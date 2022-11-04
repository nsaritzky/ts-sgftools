import { parse } from "@sabaki/sgf"
import GameTree from "@sabaki/immutable-gametree"
import { Color, Game } from "wgo"
import { toNumCoords } from "./utils"
import type { SGFNodeData, SGFNode, Board, Space } from "./types"
import type { NodeObject } from "@sabaki/immutable-gametree"
import { merge, update } from "@solid-primitives/immutable"
import { createSignal } from "solid-js"
import { StoneProps } from "./components/stone"

// interface NodeObject extends Omit<NodeObjectExt, "data"> {
//   data: Record<string, string>
// }

interface SGFOptions {
  markLast: boolean
}

const nineteen = [...Array(19).keys()]
const nineteenByNineteen = nineteen.flatMap((x) =>
  nineteen.map((y) => [x, y] as [number, number])
)

const emptySpace = (): Space => {
  const [color, setColor] = createSignal<Color>(Color.E)
  return { color, setColor }
}

const emptyBoard: Space[][] = [...Array(19).keys()].map((_) =>
  [...Array(19).keys()].map((_) => emptySpace())
)

function* sgfIter(node: SGFNode) {
  let current = node
  while (current.children[0]) {
    const { id, data } = current
    yield { id, data }
    current = current.children[0]
  }
}

const fromData = (node: Pick<SGFNode, "data">) => {
  return "B" in node.data
    ? { color: Color.B, coords: node.data["B"][0] as string }
    : { color: Color.W, coords: node.data["W"][0] as string }
}

export const trunk = (node: SGFNode) => [...sgfIter(node)]

export const sgfToTrunk = (raw: string): StoneProps[] =>
  trunk(parse(raw, { encoding: "utf8" })[0])
    .slice(1)
    .map(fromData)

export const branchToGame = (branch: StoneProps[]) => {
  const g = new Game()
  const branchNum = branch.map(toNumCoords)
  for (const move of branchNum) {
    const [x, y] = move.coords
    g.play(x - 1, y - 1)
  }
  return g
}

// With immutable-gametree //////////////////////////////////////////////////////////////////////

const getId = (
  (id) => () =>
    id++
)(0)
const getRootNodes = (raw: string) => parse(raw, { getId })

const getGameTrees = (roots: SGFNode[]) =>
  roots.map((rootNode) => {
    return new GameTree({ getId, root: rootNode })
  })

export const branchUpTo = (tree: GameTree, id: string | number) =>
  [...tree.listNodesVertically(id, -1)].reverse()

const getMainSequence = (tree: GameTree) => [...tree.listMainNodes()]

const getColor = (node: NodeObject) => {
  const d = node.data
  if (d["B"] || d["W"] || d["AB"] || d["AW"])
    return d["B"] || d["AB"] ? Color.BLACK : Color.WHITE
}

const getCoords = (node: NodeObject) => {
  const d = node.data
  const coordsMaybe = d["B"] || d["W"] || d["AB"] || d["AW"]
  if (!coordsMaybe) {
    return null
  } else {
    const coordStr = coordsMaybe[0]
    if (typeof coordStr != "string") {
      throw Error(
        `Coordinates ${coordStr} are numbers when they're expected to be a string`
      )
    } else {
      return [...coordStr].map((c) => c.charCodeAt(0) - 96) as [number, number]
    }
  }
}

export const sequenceToGame = (seq: Iterable<NodeObject>) => {
  const g = new Game()
  for (const node of seq) {
    const coords = getCoords(node)
    if (coords) {
      const [x, y] = coords
      g.play(x, 18 - y)
    }
  }
  return g
}

export const gameToBoard = (g: Game) => {
  const board = emptyBoard
  for (const [x, y] of nineteenByNineteen) {
    board[x][y].setColor(g.getStone(x, y) || Color.E)
  }
  return board
}

export const sequenceToBoard = (
  seq: NodeObject[],
  options = { markLast: false }
): Board => {
  const board = gameToBoard(sequenceToGame(seq))
  if (!options.markLast || seq.length === 0) {
    return board
  } else {
    const coords = getCoords(seq.at(-1)!)
    console.log(coords)
    if (coords === null) {
      throw Error("The last node in the sequence has no coordinates")
    } else {
      board[coords[0]][coords[1]].marked = true
    }
    return board
  }
}

export const strToBoard = (str: string, options: SGFOptions = { markLast: false }) => {
  return sequenceToBoard(
    [...getGameTrees(getRootNodes(str))[0].listMainNodes()],
    options
  )
}

const treeToGame = (tree: GameTree) => sequenceToGame(tree.listMainNodes())

export const strToGame = (raw: string) => treeToGame(getGameTrees(getRootNodes(raw))[0])

export const strToTree = (raw: string) => getGameTrees(getRootNodes(raw))[0]

const strToNodes = (raw: string) => [...strToTree(raw).listMainNodes()]

export const nodesToStones = (nodes: NodeObject[]): StoneProps[] => {
  const g = new Game()
  const board = emptyBoard
  for (const node of nodes) {
    const coords = getCoords(node)
    if (coords) {
      const [x, y] = coords
      g.play(x - 1, y - 1)
      console.log(node)
      board[x][y].move = node.id as number
    }
  }
  const ret = nineteenByNineteen
    .filter(([x, y]) => g.getStone(x, y) != Color.E)
    .map(
      ([x, y]) =>
        ({
          color: g.getStone(x, y),
          coords: [x + 1, y + 1],
          nodeId: board[x + 1][y + 1].move,
        } as StoneProps)
    )
  return ret
}

export const strToStones = (raw: string): StoneProps[] => nodesToStones(strToNodes(raw))

export const getGameInfo = (raw: string) => {
  const tree = getGameTrees(getRootNodes(raw))[0]
  return {
    tree,
    game: treeToGame(tree),
  }
}

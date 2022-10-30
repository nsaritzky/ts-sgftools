import { parse } from "@sabaki/sgf"
import type { StonePropsNum, StoneProps, MyColor } from "./board"
import { Color, Game } from "wgo"
import { toNumCoords } from "./utils"

type SGFNodeData = ({ W: string[] } | { B: string[] }) & { [key: string]: any }

interface SGFNode {
  id: number
  data: SGFNodeData
  parentId: number
  children: SGFNode[]
}

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

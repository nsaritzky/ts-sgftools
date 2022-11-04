import GameTree, { NodeObject } from "@sabaki/immutable-gametree"
import { Game, Position } from "wgo"

export const branchUpTo = (tree: GameTree, id: string | number) =>
  [...tree.listNodesVertically(id, -1)].reverse()

export const getCoords = (node: NodeObject) => {
  const d = node.data
  const coords = (d["W"] || d["B"] || d["AW"] || d["AB"])[0]
  if (coords) {
    if (typeof coords === "string") {
      return [...coords].map((c) => c.charCodeAt(0) - 96) as [number, number]
    } else {
      Error(`Stone coordinates '${coords}' should be a string`)
    }
  }
}

const getGamePosition = (tree: GameTree, id: string | number): Position => {
  const g = new Game()
  for (const node of branchUpTo(tree, id)) {
    const coords = getCoords(node)
    if (coords) {
      const [x, y] = coords
      g.play(x, y)
    }
  }
  return g.position
}

export const getLastMove = (tree: GameTree) => [...tree.listMainNodes()].reverse()[0]

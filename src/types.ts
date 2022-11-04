import type { Accessor, Setter } from "solid-js"
import type { Color } from "wgo"
import type GameTree from "@sabaki/immutable-gametree"
import { NodeObject } from "@sabaki/immutable-gametree"

export type SGFNodeData = ({ W: string[] } | { B: string[] }) & { [key: string]: any }

export interface SGFNode {
  id: number
  data: SGFNodeData
  parentId: number
  children: SGFNode[]
}

export interface StoneProps {
  color: Color
  coords: [number, number] | string
  lastMove?: boolean
}

export interface StonePropsNum {
  color: Color
  coords: [number, number]
}
export interface Space {
  color: Accessor<Color>
  move?: number
  setColor: Setter<Color>
  marked?: boolean
}

export type Board = Space[][]

export interface BoardProps {
  board?: Board
  stones?: StoneProps[]
  branch?: {
    tree: GameTree
    id: number
  }
}

import { Accessor, Setter } from "solid-js"
import type { Color } from "wgo"

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
}

export interface StonePropsNum {
  color: Color
  coords: [number, number]
}

export type Board = Space[][]

export interface BoardProps {
  board?: Board
  stones?: StoneProps[]
}

export interface Space {
  color: Accessor<Color>
  move?: number
  setColor: Setter<Color>
}

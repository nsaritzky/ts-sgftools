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

export interface Space {
  color?: Color
  move?: number
}

export type Board = Space[][]

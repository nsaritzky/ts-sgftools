declare module "@sabaki/sgf" {
  type SGFNodeData = ({ W: string[] } | { B: string[] }) & { [key: string]: any }

  interface SGFNode {
    id: number
    data: SGFNodeData
    parentId: number
    children: SGFNode[]
  }

  export function parse(
    inp: string,
    options?: { encoding?: string; getId?: () => number }
  ): SGFNode[]
}

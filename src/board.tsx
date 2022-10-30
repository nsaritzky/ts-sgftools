import Grid from "./grid"
import { Component, createSignal, For, mergeProps, Show } from "solid-js"
import { updateAt, modifyAt } from "fp-ts/Array"
import { Option } from "fp-ts/Option"
import { identity } from "fp-ts/function"
import { produce, current } from "immer"
import { Color, Game, Position } from "wgo"
import type {
  StoneProps,
  StonePropsNum,
  Space,
  Board as BoardType,
  BoardProps,
} from "./types"

const basis = 48
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

const Stone = (props: StoneProps) => {
  let x: number, y: number
  if (typeof props.coords === "string") {
    ;[x, y] = [...props.coords].map((c) => c.charCodeAt(0) - 96)
  } else {
    ;[x, y] = props.coords
  }
  return (
    <circle
      stroke="black"
      cx={basis * (x - 1)}
      cy={basis * (19 - y)}
      r={basis / 2 - 1}
      fill={props.color === Color.B ? "black" : "white"}
    />
  )
}

export const addStone = (
  board: BoardType,
  coords: [number, number] | string,
  color: Color,
  move?: number
): BoardType =>
  produce(board, (draft) => {
    const [x, y] =
      typeof coords === "string" ? [...coords].map((c) => c.charCodeAt(0) - 97) : coords
    draft[x][y].setColor(color)
  })

export const gameToBoard = (g: Game) => {
  const board = emptyBoard
  for (const [x, y] of nineteenByNineteen) {
    board[x][y].setColor(g.getStone(x, y) || Color.E)
  }
  return board
}

export const Board: Component<BoardProps> = (props) => {
  const merged: Required<BoardProps> = mergeProps(
    { board: emptyBoard, stones: [] as StoneProps[] },
    props
  )

  const filledBoard = (): BoardType =>
    merged.stones.reduce((brd, stone) => {
      return addStone(brd, stone.coords, stone.color)
    }, merged.board)

  return (
    <Grid>
      <For each={filledBoard()}>
        {(row, i) => (
          <For each={row}>
            {(space, j) => (
              <Show when={space.color()}>
                <Stone color={space.color()} coords={[i() + 1, j() + 1]} />
              </Show>
            )}
          </For>
        )}
      </For>
    </Grid>
  )
}

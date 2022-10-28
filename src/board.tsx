import Grid from "./grid"
import { Component, For, Show } from "solid-js"
import { updateAt, modifyAt } from "fp-ts/Array"
import { Option } from "fp-ts/Option"
import { identity } from "fp-ts/function"
import { produce } from "immer"

type Color = "white" | "black"

const basis = 48

interface StoneProps {
  color: Color
  coords: [number, number] | string
}

interface Space {
  color?: Color
  move?: number
}

type Board = Space[][]

const emptySpace: Space = { color: null }

const emptyBoard: Space[][] = [...Array(19).keys()].map((_) =>
  [...Array(19).keys()].map((_) => emptySpace)
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
      fill={props.color}
    />
  )
}

export const addStone = (
  board: Board,
  coords: [number, number] | string,
  color: Color,
  move?: number
): Board =>
  produce(board, (draft) => {
    const [x, y] =
      typeof coords === "string" ? [...coords].map((c) => c.charCodeAt(0) - 96) : coords
    draft[x][y] = { color, move }
  })

export const Board: Component<{ board?: Board; stones?: StoneProps[] }> = (props) => {
  const board = props.board || emptyBoard
  const stones = props.stones || []

  const filledBoard = stones.reduce(
    (brd, stone) => addStone(brd, stone.coords, stone.color),
    board
  )

  return (
    <Grid>
      <For each={filledBoard}>
        {(row, i) => (
          <For each={row}>
            {(space, j) => (
              <Show when={space.color}>
                <Stone color={space.color} coords={[i(), j()]} />
              </Show>
            )}
          </For>
        )}
      </For>
    </Grid>
  )
}

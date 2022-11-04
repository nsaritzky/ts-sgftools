import { Color } from "wgo"
import { Show } from "solid-js"

const basis = 48

export interface StoneProps {
  color: Color
  coords: [number, number] | string
  nodeId: number
  marked?: boolean
}

const Stone = (props: StoneProps) => {
  let x: number, y: number
  if (typeof props.coords === "string") {
    ;[x, y] = [...props.coords].map((c) => c.charCodeAt(0) - 96)
  } else {
    ;[x, y] = props.coords
  }
  return (
    <>
      <circle
        stroke="black"
        cx={basis * (x - 1)}
        cy={basis * (y - 1)}
        r={basis / 2 - 1}
        fill={props.color === Color.B ? "black" : "white"}
      />
      <Show when={props.marked}>
        <circle
          stroke={props.color === Color.B ? "white" : "black"}
          cy={basis * (y - 1)}
          cx={basis * (x - 1)}
          r={basis / 4}
          stroke-width="4"
          fill="none"
        />
      </Show>
    </>
  )
}

export default Stone

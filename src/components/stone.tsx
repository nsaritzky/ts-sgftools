import { Color } from "wgo"
import { Show } from "solid-js"

const basis = 48
const TEXT_X_OFFSET = 0.21
const TEXT_Y_OFFSET = -0.27

export interface StoneProps {
  color: Color
  coords: [number, number] | string
  nodeId: number
  marked?: boolean
  numbered?: number
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
      <Show when={props.numbered}>
        <text
          x={basis * (x - (1 + TEXT_X_OFFSET))}
          y={basis * (y - (1 + TEXT_Y_OFFSET))}
          style={{ font: `${basis * 0.8}px sans-serif` }}
          fill={props.color === Color.B ? "white" : "black"}
        >
          {props.numbered}
        </text>
      </Show>
    </>
  )
}

export default Stone

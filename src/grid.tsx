import { Index, render } from "solid-js/web"
import type { Component, ParentComponent } from "solid-js"

export const basis = 48
const size = 18 * 48
const COORDINATE_FONT_PROPORTION = 0.7

const numberToLetterCoord = (n: number) =>
  n < 8 ? String.fromCharCode(65 + n) : String.fromCharCode(66 + n)

const Grid: ParentComponent = (props) => (
  <svg
    class="w-full h-auto"
    viewBox={`${(-3 * basis) / 2} ${(-3 * basis) / 2} ${size + 2 * basis} ${
      size + 2 * basis
    }`}
    role="img"
    aria-labelledby="boardTitle"
  >
    <title id="boardTitle">Go Board</title>
    <Index each={[...Array(19).keys()]}>
      {(n) => (
        <>
          <text
            x={n() * basis}
            y={basis * -0.5}
            style={{ font: `${basis * COORDINATE_FONT_PROPORTION}px sans-serif` }}
            text-anchor="middle"
          >
            {numberToLetterCoord(n())}
          </text>
          <line
            x1={n() * basis}
            y1={0}
            x2={n() * basis}
            y2={size}
            stroke-width={1}
            stroke="black"
          />
        </>
      )}
    </Index>
    <Index each={[...Array(19).keys()]}>
      {(n) => (
        <>
          <text
            x={basis * -1}
            y={n() * basis}
            dy="0.25em"
            text-anchor="middle"
            style={{ font: `${basis * COORDINATE_FONT_PROPORTION}px sans-serif` }}
          >
            {19 - n()}
          </text>
          <line
            y1={n() * basis}
            x1={0}
            y2={n() * basis}
            x2={size}
            stroke-width={1}
            stroke="black"
          />
        </>
      )}
    </Index>
    {props.children}
  </svg>
)

export default Grid

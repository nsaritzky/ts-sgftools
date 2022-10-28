import { Index, render } from "solid-js/web"
import type { Component, ParentComponent } from "solid-js"

export const basis = 48
const size = 18 * 48

const Grid: ParentComponent = (props) => (
  <svg
    class="w-full h-auto"
    viewBox={`${-basis / 2} ${-basis / 2} ${size + basis} ${size + basis}`}
  >
    <Index each={[...Array(19).keys()]}>
      {(n) => (
        <line
          x1={n() * basis}
          y1={0}
          x2={n() * basis}
          y2={size}
          stroke-width={1}
          stroke="black"
        />
      )}
    </Index>
    <Index each={[...Array(19).keys()]}>
      {(n) => (
        <line
          y1={n() * basis}
          x1={0}
          y2={n() * basis}
          x2={size}
          stroke-width={1}
          stroke="black"
        />
      )}
    </Index>
    {props.children}
  </svg>
)

export default Grid

import type { StoneProps, StonePropsNum } from "./board"

export const toNumCoords = (s: StoneProps): StonePropsNum => {
  if (typeof s.coords === "string") {
    return {
      ...s,
      coords: [...s.coords].map((c) => c.charCodeAt(0) - 96) as [number, number],
    }
  } else {
    return s as StonePropsNum
  }
}

import type { Component } from "solid-js"
import { Board, addStone } from "./board"

const App: Component = () => (
  <div class="max-w-lg m-auto">
    <Board stones={[{ color: "black", coords: "ap" }]} />
  </div>
)
export default App

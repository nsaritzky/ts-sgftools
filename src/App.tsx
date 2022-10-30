import type { Component } from "solid-js"
import { createResource } from "solid-js"
import { Board, addStone, gameToBoard } from "./board"
import { createFileUploader } from "@solid-primitives/upload"
import { trunk, sgfToTrunk, branchToGame } from "./sgf"
import * as fs from "fs"
import sgfRaw from "./48129218-270-ghg-blee.dublin.sgf?raw"

const branch = sgfToTrunk(sgfRaw)
const game = branchToGame(branch)

const App: Component = () => {
  return (
    <div class="max-w-lg m-auto">
      <Board board={gameToBoard(game)} />
    </div>
  )
}
export default App

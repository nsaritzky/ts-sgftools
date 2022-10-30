import { Component, createEffect, createSignal } from "solid-js"
import { createResource } from "solid-js"
import { Board, addStone, gameToBoard } from "./board"
import { createFileUploader, UploadFile } from "@solid-primitives/upload"
import { trunk, sgfToTrunk, branchToGame } from "./sgf"
import * as fs from "fs"
import { Game } from "wgo"
import preSgf from "./48129218-270-ghg-blee.dublin.sgf?raw"
import "solid-devtools"

const emptyGame = new Game()

const App: Component = () => {
  const { files, selectFiles } = createFileUploader({ accept: ".sgf" })
  const [raw, setRaw] = createSignal<string>()
  const board = () => gameToBoard(raw() ? branchToGame(sgfToTrunk(raw()!)) : emptyGame)

  /* const sgfRawAsync = async () => await files()[0].file.text()
   * const branch = sgfToTrunk(sgfRaw()!)
   * const game = branchToGame(branch) */

  const gamePromise = (raw: string) => {
    return branchToGame(sgfToTrunk(raw))
  }

  createEffect(() => console.log(board()))

  return (
    <div class="max-w-lg m-auto">
      <button
        onClick={() => {
          selectFiles(async ([{ file }]) => {
            const sgf = await file.text()
            setRaw(sgf)
          })
        }}
      >
        Select
      </button>
      <Board board={board()} />
    </div>
  )
}
export default App

import { Component, createEffect, createSignal, Show } from "solid-js"
import { createResource } from "solid-js"
import {
  Board,
  addStone,
  gameToBoard,
  BoardFromSequence,
  BoardFromString,
  BoardFromStringToStones,
} from "./board"
import { createFileUploader, UploadFile } from "@solid-primitives/upload"
import {
  trunk,
  sgfToTrunk,
  branchToGame,
  strToGame,
  strToTree,
  strToBoard,
} from "./sgf"
import * as fs from "fs"
import { Game } from "wgo"
import preSgf from "./48129218-270-ghg-blee.dublin.sgf?raw"
import "solid-devtools"
import Upload from "./components/upload"
import GameTree from "@sabaki/immutable-gametree"
import Reader from "./components/reader"

const emptyGame = new Game()
export const [raw, setRaw] = createSignal<string>()

const App: Component = () => {
  /* const board = () => gameToBoard(raw() ? branchToGame(sgfToTrunk(raw()!)) : emptyGame) */

  /* const sgfRawAsync = async () => await files()[0].file.text()
   * const branch = sgfToTrunk(sgfRaw()!)
   * const game = branchToGame(branch) */

  return (
    <div class="max-w-lg m-auto">
      <div class="flex justify-center">
        <Upload />
      </div>
      <Show when={raw()} fallback={<Board />} keyed>
        {(str) => <Reader sgf={str} />}
      </Show>
    </div>
  )
}
export default App

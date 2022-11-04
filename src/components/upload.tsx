import {
  createFileUploader,
  createDropzone,
  UploadFile,
} from "@solid-primitives/upload"
import type { Component } from "solid-js"
import { setRaw } from "../App"

const Upload: Component = () => {
  const { selectFiles } = createFileUploader({ accept: ".sgf" })
  const setSGF = async ([{ file }]: UploadFile[]) => {
    const sgf = await file.text()
    setRaw(sgf)
  }
  const { setRef: dropzoneRef } = createDropzone({
    onDrop: setSGF,
  })
  return (
    <div class="border p-10 rounded bg-gray-100 shadow" ref={dropzoneRef}>
      <button
        class="px-4 py-2 bg-blue-400 rounded "
        onClick={() => {
          selectFiles(setSGF)
        }}
      >
        Select
      </button>
    </div>
  )
}

export default Upload

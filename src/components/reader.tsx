import { Component, createMemo, createSignal } from "solid-js"
import { BoardFromStringToStones } from "../board"
import { branchUpTo, strToTree } from "../sgf"

interface ReaderProps {
  sgf: string
}

const Reader: Component<ReaderProps> = (props) => {
  const [nodeID, setNodeID] = createSignal<number>(11)
  const tree = createMemo(() => strToTree(props.sgf))

  const nextNode = () => {
    setNodeID((curr) => tree().navigate(curr, 1, {}).id as number)
  }
  const prevNode = () => {
    setNodeID((curr) => tree().navigate(curr, -1, {}).id as number)
  }

  return (
    <>
      <BoardFromStringToStones
        nodes={branchUpTo(tree(), nodeID())}
        lastMove={nodeID()}
      />
      <button onclick={prevNode}>prev</button>
      <button onclick={nextNode}>next</button>
    </>
  )
}

export default Reader

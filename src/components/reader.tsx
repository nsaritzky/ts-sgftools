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
    setNodeID((prev) => tree().navigate(prev, 1, {}).id as number)
    console.log(tree().get(nodeID()))
  }

  return (
    <>
      <button onclick={nextNode}>next</button>
      <BoardFromStringToStones
        nodes={branchUpTo(tree(), nodeID())}
        lastMove={nodeID()}
      />
    </>
  )
}

export default Reader

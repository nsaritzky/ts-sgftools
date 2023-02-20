import { Component, createMemo, createSignal } from "solid-js"
import { BoardFromStringToStones } from "../board"
import { branchUpTo, strToTree } from "../sgf"
import { NodeObject } from "@sabaki/immutable-gametree"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
} from "lucide-solid"
import { getComment, readPointLoss } from "../card-maker"
import { biggestPointLosses, altSequence } from "../card-maker"
import { siblingNodes } from "../utils"
import { chainNullableK } from "fp-ts/lib/Option"
import CommentBox from "./comment-box"

const JUMP_SIZE = 10

interface Props {
  sgf: string
}

const Reader: Component<Props> = (props) => {
  const [nodeID, setNodeID] = createSignal<number>(0)
  const tree = createMemo(() => strToTree(props.sgf))
  const node = () => tree().get(nodeID())
  const isLastNode = () => tree().navigate(nodeID(), 1, {}) == null
  const isFirstNode = () => tree().navigate(nodeID(), -1, {}) == null
  const isFirstSibling = () => tree().listNodesHorizontally(nodeID(), -1)[1] == null
  const isLastSibling = () => tree().listNodesHorizontally(nodeID(), 1) == null
  const mistakes = () => [...tree().listMainNodes()].filter((n) => n.data.C)

  const nextNode = () => {
    if (getComment(node())) {
      console.log(altSequence(node()))
    }
    if (tree()) {
      setNodeID((curr) =>
        tree().navigate(curr, 1, {}) ? tree().navigate(curr, 1, {}).id : curr
      )
    }
  }
  const prevNode = () => {
    if (tree()) {
      setNodeID((curr) =>
        tree().navigate(curr, -1, {}) ? tree().navigate(curr, -1).id : curr
      )
    }
  }

  const jumpBack = () => {
    if (tree()) {
      setNodeID((curr) =>
        tree().navigate(curr, -1 * JUMP_SIZE, {})
          ? tree().navigate(curr, -1 * JUMP_SIZE, {}).id
          : tree().root.id
      )
    }
  }

  const jumpForward = () => {
    if (tree()) {
      setNodeID((curr) =>
        tree().navigate(curr, JUMP_SIZE, {})
          ? tree().navigate(curr, JUMP_SIZE, {}).id
          : curr
      )
    }
  }

  const prevSibling = () => {
    if (tree()) {
      setNodeID((curr) =>
        isFirstSibling() ? curr : tree().listNodesHorizontally(curr, -1)[1].id
      )
    }
  }

  const nextSibling = () => {
    if (tree()) {
      setNodeID((curr) =>
        isFirstSibling() ? curr : tree().listNodesHorizontally(curr, 1)[1].id
      )
    }
  }

  const jumpToFirst = () => {
    if (tree()) {
      setNodeID(tree().root.id)
    }
  }

  const jumpToLast = () => {
    if (tree()) {
      setNodeID((curr) => {
        const branch = [...tree().listNodesVertically(curr, 1, {})]
        return branch[branch.length - 1].id
      })
    }
  }

  return (
    <>
      <BoardFromStringToStones
        nodes={branchUpTo(tree(), nodeID())}
        lastMove={nodeID()}
      />

      <div class="flex justify-center">
        <button
          disabled={isFirstNode()}
          aria-label="first node"
          onclick={jumpToFirst}
          tabindex={0}
        >
          <ChevronFirst
            color={isFirstNode() ? "gray" : "black"}
            aria-hidden
            size={36}
          />
        </button>
        <button
          disabled={isFirstNode()}
          aria-label="previous node"
          onclick={jumpBack}
          tabindex={0}
        >
          <ChevronsLeft
            color={isFirstNode() ? "gray" : "black"}
            aria-hidden
            size={36}
          />
        </button>
        <button
          disabled={isFirstNode()}
          aria-label="previous node"
          onclick={prevNode}
          tabindex={0}
        >
          <ChevronLeft color={isFirstNode() ? "gray" : "black"} aria-hidden size={36} />
        </button>
        <button
          disabled={isFirstSibling()}
          aria-label="previous sibling"
          onclick={prevSibling}
          tabindex={0}
        >
          <ChevronUp
            color={isFirstSibling() ? "gray" : "black"}
            aria-hidden
            size={36}
          />
        </button>
        <button
          disabled={isLastSibling()}
          aria-label="next sibling"
          onclick={nextSibling}
          tabindex={0}
        >
          <ChevronDown
            color={isFirstSibling() ? "gray" : "black"}
            aria-hidden
            size={36}
          />
        </button>
        <button
          disabled={isLastNode()}
          aria-label="next node"
          onclick={nextNode}
          tabIndex={0}
        >
          <ChevronRight color={isLastNode() ? "gray" : "black"} aria-hidden size={36} />
        </button>
        <button
          disabled={isLastNode()}
          aria-label="next node"
          onclick={jumpForward}
          tabIndex={0}
        >
          <ChevronsRight
            color={isLastNode() ? "gray" : "black"}
            aria-hidden
            size={36}
          />
        </button>
        <button
          disabled={isLastNode()}
          aria-label="next node"
          onclick={jumpToLast}
          tabIndex={0}
        >
          <ChevronLast color={isLastNode() ? "gray" : "black"} aria-hidden size={36} />
        </button>
      </div>
      <CommentBox comment={node().data.C && node().data.C[0]} />
    </>
  )
}

export default Reader

import { Component } from "solid-js"

interface Props {
  comment: string | undefined
}

const CommentBox: Component<Props> = (props) => (
  <div class="max-h-48 whitespace-pre-wrap border shadow-inner overflow-auto">
    {props.comment}
  </div>
)

export default CommentBox

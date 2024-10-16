import { TwitterShareButton, XIcon } from "react-share";

export default function TwitterButton(props: { url: string, size:number }) {
  return (
    <TwitterShareButton
      url={props.url}>
      <XIcon size={props.size} round/>
    </TwitterShareButton>
  )
}

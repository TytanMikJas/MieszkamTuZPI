import { LinkedinIcon, LinkedinShareButton } from "react-share";

export default function LinkedinButton(props: { url: string, size: number }) {
  return (
    <LinkedinShareButton
      url={props.url}>
      <LinkedinIcon size={props.size} round/>
    </LinkedinShareButton>
  )
}

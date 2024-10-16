import { WhatsappShareButton, WhatsappIcon } from "react-share";

export default function WhatsUpButton(props: { url: string, size: number }) {
  return (
    <WhatsappShareButton
      url={props.url}
    >
      <WhatsappIcon size={props.size} round/>
    </WhatsappShareButton>
  )
}

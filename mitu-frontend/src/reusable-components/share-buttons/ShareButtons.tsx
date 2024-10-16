import FbButton from "@/reusable-components/ShareButtons/components/FbButton";
import WhatsUpButton from "@/reusable-components/ShareButtons/components/WhatsUpButton";
import LinkedinButton from "@/reusable-components/ShareButtons/components/LinkedinButton";
import TwitterButton from "@/reusable-components/ShareButtons/components/TwitterButton";
import { Helmet } from "react-helmet";

export default function ShareButtons(props: { url: string, buttonSize: number, thumbnail: string }) {

  return (
    <>
    <Helmet>
      <meta property={'og:image'} content={`${import.meta.env.VITE_FILES}${props.thumbnail}`}/>
    </Helmet>

      <div className={"flex flex-row justify-between items-center m-1 gap-1"}>
        <FbButton size={props.buttonSize} url={props.url}/>
        <WhatsUpButton size={props.buttonSize} url={props.url}/>
        <TwitterButton size={props.buttonSize} url={props.url}/>
        <LinkedinButton size={props.buttonSize} url={props.url}/>
      </div>
    </>
  )
}

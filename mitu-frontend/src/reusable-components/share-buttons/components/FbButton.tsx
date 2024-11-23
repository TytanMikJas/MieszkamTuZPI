import { FacebookIcon, FacebookShareButton } from 'react-share';

export default function FbButton(props: { url: string; size: number }) {
  return (
    <FacebookShareButton url={props.url} hashtag={'#mapaMieszkamTu'}>
      <FacebookIcon size={props.size} round />
    </FacebookShareButton>
  );
}

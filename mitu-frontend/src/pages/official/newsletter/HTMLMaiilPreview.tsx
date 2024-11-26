import { useEffect } from 'react';

type Props = { html: string };

function HTMLMaiilPreview({ html }: Props) {
  useEffect(() => {
    const host = document.getElementById('mail-preview');
    host?.attachShadow({ mode: 'open' });
  }, []);
  useEffect(() => {
    const host = document.getElementById('mail-preview');
    const shadow = host?.shadowRoot;
    if (!shadow) return;
    shadow.innerHTML = html;
  }, [html]);
  return (
    <div
      id="mail-preview"
      className="border-gray-400 border-2 p-3 m-5 min-h-[80vh] overflow-y-scroll"
    />
  );
}

export default HTMLMaiilPreview;

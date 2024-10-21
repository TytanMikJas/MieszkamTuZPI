export default function ImagePreview({ url }: { url: string }) {
  return (
    <div
      style={{ backgroundImage: `url(${url})` }}
      className="rounded-lg w-full h-full bg-center bg-cover bg-no-repeat"
    />
  );
}

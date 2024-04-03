export default function Video({ videoId }: TypeVideo) {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Youtube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;web-share"
      />
    </div>
  );
}

interface Props {
  videoId: string;
  title?: string;
}

export default function YouTube({ videoId, title }: Props) {
  return (
    <div className="flex justify-center aspect-video">
      <iframe
        className="w-full"
        height="378px"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title ?? "YouTube video player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

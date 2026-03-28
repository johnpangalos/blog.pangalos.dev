const stripeStyle: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(120deg, #f97316 0, #f97316 30px, #374151 30px, #374151 60px)",
};

export default function SpoilerAlert() {
  return (
    <div
      data-testid="spoiler-alert"
      className="mt-10 flex w-full justify-center py-10"
      style={stripeStyle}
    >
      <div className="flex max-w-md items-center justify-center border-8 border-black bg-white p-3">
        <div className="px-2 text-3xl font-medium text-black">
          SPOILER ALERT
        </div>
      </div>
    </div>
  );
}

const stripeStyle: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(120deg, #facc15 0, #facc15 30px, #374151 30px, #374151 60px)",
};

export default function NerdAlert() {
  return (
    <div
      data-testid="nerd-alert"
      className="mt-10 flex w-full justify-center py-10"
      style={stripeStyle}
    >
      <div className="flex max-w-md items-center justify-center border-8 border-black bg-white p-3">
        <div className="px-2 text-3xl font-medium text-black">NERD ALERT</div>
      </div>
    </div>
  );
}

interface Props {
  number: number;
}

export default function FootnoteLink({ number }: Props) {
  return (
    <a
      className="mx-0.5 text-orange-500 dark:text-orange-400"
      href={`#${number}`}
    >
      <sup>{number}</sup>
    </a>
  );
}

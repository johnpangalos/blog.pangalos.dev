interface Props {
  number: number;
}

export default function FootnoteAnchor({ number }: Props) {
  return (
    <span data-testid="footnote-anchor">
      <a className="text-fuchsia-500 dark:text-fuchsia-300" id={String(number)}>
        <sup>{number}</sup>
      </a>
    </span>
  );
}

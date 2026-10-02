interface ChevronIconProps {
  direction: 'left' | 'right';
}

/** An arrow head for previous/next buttons. Decorative: the button carries the accessible name. */
export default function ChevronIcon({ direction }: ChevronIconProps): React.JSX.Element {
  return (
    <svg
      viewBox='0 0 24 24'
      width='20'
      height='20'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      focusable='false'
    >
      <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

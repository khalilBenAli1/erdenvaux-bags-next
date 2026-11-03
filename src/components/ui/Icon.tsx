export type IconName =
  'arrow' | 'heart' | 'bag' | 'close' | 'menu' | 'minus' | 'plus' | 'check';
const paths: Record<IconName, string> = {
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  heart:
    'M20.8 4.6a5.3 5.3 0 0 0-7.5 0L12 5.9l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 21l8.8-8.9a5.3 5.3 0 0 0 0-7.5Z',
  bag: 'M5 7h14l1 14H4L5 7Zm4 1V6a3 3 0 0 1 6 0v2',
  close: 'm5 5 14 14M19 5 5 19',
  menu: 'M3 8h18M3 16h18',
  minus: 'M5 12h14',
  plus: 'M5 12h14M12 5v14',
  check: 'm4 12 5 5L20 6',
};
export function Icon({
  name,
  filled = false,
}: {
  name: IconName;
  filled?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}

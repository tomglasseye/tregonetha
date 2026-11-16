/**
 * The thin-line symbols used under the hero and on the tab cards. One stroke
 * weight, drawn on a 48px grid so they sit together as a set.
 */
export const ICON_NAMES = [
  'tent',
  'fish',
  'cutlery',
  'rings',
  'leaf',
  'calendar',
  'pin',
  'mail',
  'phone',
  'star',
] as const

export type IconName = (typeof ICON_NAMES)[number]

const PATHS: Record<IconName, React.ReactNode> = {
  // A bell tent: pole, canopy, door flap and ground line.
  tent: (
    <>
      <path d="M24 5v6" />
      <path d="M24 11 6 40h36L24 11Z" />
      <path d="M24 40 16 40 24 22l8 18" />
      <path d="M3 40h42" />
    </>
  ),
  // A single fish in profile.
  fish: (
    <>
      <path d="M6 24c5-9 13-12 21-10 5 1 9 5 11 10-2 5-6 9-11 10-8 2-16-1-21-10Z" />
      <path d="M38 24l6-7v14l-6-7Z" />
      <circle cx="14" cy="22" r="1.3" fill="currentColor" stroke="none" />
      <path d="M22 17c2 4 2 10 0 14" />
    </>
  ),
  // Knife and fork, crossed.
  cutlery: (
    <>
      <path d="M12 6v10a4 4 0 0 0 4 4v22" />
      <path d="M8 6v10a4 4 0 0 0 4 4" />
      <path d="M16 6v10" />
      <path d="M33 42V6c-5 3-7 9-7 15 0 3 2 5 7 5" />
    </>
  ),
  // Two interlocked rings.
  rings: (
    <>
      <circle cx="18" cy="29" r="11" />
      <circle cx="30" cy="29" r="11" />
      <path d="M13 10h10l3 5-8 6-8-6 3-5Z" />
    </>
  ),
  // A leaf with its central vein.
  leaf: (
    <>
      <path d="M8 40C6 22 16 8 42 6c1 26-12 36-28 34" />
      <path d="M8 40C18 28 26 20 34 14" />
    </>
  ),
  calendar: (
    <>
      <rect x="6" y="9" width="36" height="33" rx="4" />
      <path d="M6 19h36M16 5v8M32 5v8" />
    </>
  ),
  pin: (
    <>
      <path d="M24 44S10 30 10 19a14 14 0 0 1 28 0c0 11-14 25-14 25Z" />
      <circle cx="24" cy="19" r="5" />
    </>
  ),
  mail: (
    <>
      <rect x="5" y="10" width="38" height="28" rx="4" />
      <path d="m6 13 18 14 18-14" />
    </>
  ),
  phone: (
    <path d="M42 34v5a3 3 0 0 1-3.3 3A33 33 0 0 1 4.9 9.3 3 3 0 0 1 8 6h5a3 3 0 0 1 3 2.6c.2 1.7.6 3.3 1.2 4.8a3 3 0 0 1-.7 3.2l-2 2a24 24 0 0 0 11 11l2-2a3 3 0 0 1 3.2-.7c1.5.6 3.1 1 4.8 1.2A3 3 0 0 1 42 34Z" />
  ),
  star: <path d="m24 5 5.6 11.8 12.9 1.6-9.5 8.9 2.5 12.8L24 33.8 12.5 40.1 15 27.3 5.5 18.4l12.9-1.6L24 5Z" />,
}

export function LineIcon({name, className = 'h-10 w-10'}: {name?: string; className?: string}) {
  const node = PATHS[name as IconName]
  if (!node) return null
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {node}
    </svg>
  )
}

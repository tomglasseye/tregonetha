import {Link} from 'react-router'
import type {Cta, SiteSettings, Tone} from '~/types'
import {opt} from '~/lib/stega'

type Props = {
  cta?: Cta
  settings?: SiteSettings
  tone?: Tone
  className?: string
  /** Adds the little chevron seen on the hero button. */
  arrow?: boolean
}

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-6 py-3 text-base font-semibold transition-colors duration-200 no-underline'

function classesFor(variant: string, tone?: Tone) {
  const onDark = tone === 'lake'
  switch (variant) {
    case 'secondary':
      return onDark
        ? `${BASE} border-2 border-cream text-cream hover:bg-cream hover:text-lake`
        : `${BASE} border-2 border-teal text-teal hover:bg-teal hover:text-cream`
    case 'ghost':
      return onDark
        ? 'inline-flex items-center gap-2 text-cream underline underline-offset-4 hover:text-mist'
        : 'inline-flex items-center gap-2 text-teal underline underline-offset-4 hover:text-lake'
    default:
      // Bright turquoise on every ground: the one call to action colour on the site.
      // Dark text, because white on this turquoise is only ~2.5:1.
      return `${BASE} bg-aqua text-aqua-ink hover:bg-aqua-deep`
  }
}

/**
 * Resolves the link. A tel:/mailto: link left blank in Studio falls back to the
 * number or address in Site Settings — that is the "change it once" promise.
 */
export function resolveHref(cta?: Cta, settings?: SiteSettings): string {
  const link = cta?.link
  if (!link) return '#'

  if (link.needsSiteContact) {
    if (link.kind === 'tel' && settings?.phone) return telHref(settings.phone)
    if (link.kind === 'email' && settings?.email) return `mailto:${settings.email}`
  }

  // GROQ has no string-replace in this API version, so tel: hrefs arrive with
  // the number formatted for reading. Strip the spaces here instead.
  if (link.href?.startsWith('tel:')) return telHref(link.href.slice(4))

  return link.href || '#'
}

/** "07974 937649" -> "tel:07974937649" */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

export function Button({cta, settings, tone, className = '', arrow = false}: Props) {
  if (!cta?.label) return null

  const href = resolveHref(cta, settings)
  const classes = `${classesFor(opt(cta.variant) ?? 'primary', opt(tone))} ${className}`
  const isInternal = href.startsWith('/') && !href.startsWith('//')

  if (isInternal) {
    return (
      <Link to={href} className={classes}>
        {cta.label}
        {arrow ? <span aria-hidden>&rsaquo;</span> : null}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={classes}
      {...(cta.link?.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
    >
      {cta.label}
      {arrow ? <span aria-hidden>&rsaquo;</span> : null}
    </a>
  )
}

export function ButtonRow({
  buttons,
  settings,
  tone,
  className = '',
  arrow = false,
}: {
  buttons?: Cta[] | null
  settings?: SiteSettings
  tone?: Tone
  className?: string
  arrow?: boolean
}) {
  if (!buttons?.length) return null
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {buttons.map((cta, i) => (
        <Button key={cta._key ?? i} cta={cta} settings={settings} tone={tone} arrow={arrow} />
      ))}
    </div>
  )
}

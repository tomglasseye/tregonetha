import {Link} from 'react-router'
import type {Navigation, SiteSettings} from '~/types'
import {resolveHref} from './ui/Button'
import {formatAddress} from './sections/ContactDetails'
import {logoSrc} from '~/lib/logo'

export function Footer({
  navigation,
  settings,
}: {
  navigation?: Navigation
  settings?: SiteSettings
}) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-lake text-cream">
      <div className="u-container pb-12 pt-24 md:pt-28">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img
              src={logoSrc(settings, 144)}
              alt=""
              width={72}
              height={72}
              className="mb-5 h-[4.5rem] w-[4.5rem]"
            />
            <p className="font-display text-2xl">{settings?.businessName ?? 'Tregonetha Lake'}</p>
            {settings?.tagline ? (
              <p className="mt-3 max-w-[30ch] text-sm text-cream/70">{settings.tagline}</p>
            ) : null}
          </div>

          {(navigation?.footerColumns ?? []).map((column, i) => (
            <nav key={column._key ?? i} aria-label={column.heading ?? undefined}>
              {column.heading ? (
                <h2 className="u-eyebrow mb-4 text-cream/75">{column.heading}</h2>
              ) : null}
              <ul className="space-y-2.5">
                {(column.links ?? []).map((link, j) => (
                  <li key={link._key ?? j}>
                    <Link
                      to={resolveHref({link: link.link}, settings)}
                      className="text-sm text-cream/85 no-underline transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="u-eyebrow mb-4 text-cream/75">Get in touch</h2>
            <ul className="space-y-2.5 text-sm">
              {settings?.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="text-cream/85 no-underline hover:text-cream"
                  >
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {settings?.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-words text-cream/85 no-underline hover:text-cream"
                  >
                    {settings.email}
                  </a>
                </li>
              ) : null}
              {settings?.address ? (
                <li>
                  <address className="not-italic text-cream/70">
                    {formatAddress(settings.address)}
                  </address>
                </li>
              ) : null}
            </ul>

            <ul className="mt-5 flex gap-4 text-sm">
              {settings?.instagramHandle ? (
                <li>
                  <a
                    href={`https://instagram.com/${settings.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/85 no-underline hover:text-cream"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
              {settings?.facebookUrl ? (
                <li>
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/85 no-underline hover:text-cream"
                  >
                    Facebook
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/15 pt-8 text-sm text-cream/70 md:flex-row md:items-center md:justify-between">
          <p>
            &copy;{year} {settings?.businessName ?? 'Tregonetha Lake'}
            {settings?.companyNumber ? ` | Company Number: ${settings.companyNumber}` : ''}
          </p>
          <ul className="flex flex-wrap gap-5">
            {(navigation?.legalLinks ?? []).map((link, i) => (
              <li key={link._key ?? i}>
                <Link
                  to={resolveHref({link: link.link}, settings)}
                  className="text-cream/75 no-underline hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://dawnconcept.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 no-underline hover:text-cream"
              >
                Website by The Dawn Concept
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

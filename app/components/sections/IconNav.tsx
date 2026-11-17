import {Link} from 'react-router'
import type {IconNavSection} from '~/types'
import {Section as Wrapper} from '../ui/Section'
import {LineIcon} from '../ui/LineIcon'

/** The strip of symbols under the hero — one per main page. */
export function IconNav({section}: {section: IconNavSection}) {
  const items = section.items ?? []
  if (!items.length) return null

  return (
    <Wrapper
      appearance={{...section.appearance, spacing: section.appearance?.spacing ?? 'tight', waveEdge: false}}
      reveal={false}
    >
      <nav aria-label="Explore Tregonetha Lake">
        <ul className="u-icon-nav grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
          {items.map((item, i) => (
            <li key={item._key ?? i} className="px-1 sm:px-3 lg:first:pl-0">
              <Link
                to={item.href ?? '#'}
                className="group flex items-center justify-start gap-3 rounded-input px-2 py-2 text-lake no-underline sm:justify-center md:gap-4"
              >
                <LineIcon
                  name={item.icon}
                  className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 md:h-12 md:w-12"
                />
                <span className="text-sm font-semibold leading-snug md:text-base">
                  {item.label}
                  {item.sublabel ? (
                    <span className="block text-[0.8125rem] font-medium text-muted md:text-sm">
                      {item.sublabel}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Wrapper>
  )
}

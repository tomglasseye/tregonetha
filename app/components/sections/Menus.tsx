import type {MenusSection, SiteSettings} from '~/types'
import {Section as Wrapper, toneMuted} from '../ui/Section'
import {SectionHeader} from './SectionHeader'
import {opt} from '~/lib/stega'

/** Wildfire's food and drink menus: typed in, a PDF, or both. */
export function Menus({section}: {section: MenusSection; settings?: SiteSettings}) {
  const {eyebrow, heading, intro, footnote, appearance} = section
  const tone = opt(appearance?.tone)
  const onDark = tone === 'lake'
  const muted = toneMuted(tone)
  const panel = onDark ? 'bg-cream/10' : tone === 'mist' ? 'bg-cream' : 'bg-mist-soft'
  const rule = onDark ? 'border-cream/20' : 'border-rule'
  const menus = section.menus ?? []

  return (
    <Wrapper appearance={appearance}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} tone={tone} />

      <div className={`grid gap-8 ${menus.length > 1 ? 'lg:grid-cols-2' : 'max-w-3xl'}`}>
        {menus.map((menu, i) => (
          <article key={menu._key ?? i} className={`rounded-panel p-6 md:p-8 ${panel}`}>
            <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className={`font-display text-2xl ${onDark ? 'text-cream' : 'text-lake'}`}>{menu.title}</h3>
              {menu.fileUrl ? (
                <a
                  href={menu.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-semibold underline underline-offset-4 ${onDark ? 'text-cream' : 'text-teal'}`}
                >
                  Download the {menu.title?.toLowerCase() ?? 'menu'} (PDF)
                </a>
              ) : null}
            </header>
            {menu.note ? <p className={`mt-1 text-sm ${muted}`}>{menu.note}</p> : null}

            {(menu.groups ?? []).map((group, g) => (
              <section key={group._key ?? g} className="mt-7">
                {group.heading ? (
                  <h4 className={`u-eyebrow mb-3 ${onDark ? 'text-cream/80' : 'text-teal'}`}>{group.heading}</h4>
                ) : null}
                <ul>
                  {(group.items ?? []).map((item, j) => (
                    <li
                      key={item._key ?? j}
                      className={`flex items-baseline justify-between gap-6 border-b border-dashed py-3 ${rule}`}
                    >
                      <span>
                        <span className="font-semibold">{item.name}</span>
                        {item.dietary ? <span className={`ml-2 text-xs ${muted}`}>({item.dietary})</span> : null}
                        {item.description ? (
                          <span className={`block text-sm ${muted}`}>{item.description}</span>
                        ) : null}
                      </span>
                      {item.price ? <span className="whitespace-nowrap font-semibold">{item.price}</span> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {!menu.groups?.length && !menu.fileUrl ? (
              <p className={`mt-5 ${muted}`}>Menu coming soon.</p>
            ) : null}
          </article>
        ))}
      </div>

      {footnote ? <p className={`mt-6 max-w-[70ch] whitespace-pre-line text-sm ${muted}`}>{footnote}</p> : null}
    </Wrapper>
  )
}

import type {PriceTableSection, SiteSettings} from '~/types'
import {ButtonRow} from '../ui/Button'
import {Section as Wrapper, toneMuted} from '../ui/Section'
import {SectionHeader} from './SectionHeader'
import {opt} from '~/lib/stega'

/**
 * One or more price tables. The first column is treated as the row's label
 * (a date band, a tent, a ticket type) and read out as a row header.
 */
export function PriceTable({section, settings}: {section: PriceTableSection; settings?: SiteSettings}) {
  const {eyebrow, heading, intro, footnote, buttons, appearance} = section
  const tone = opt(appearance?.tone)
  const onDark = tone === 'lake'
  const muted = toneMuted(tone)
  const panel = onDark ? 'bg-cream/10' : tone === 'mist' ? 'bg-cream' : 'bg-mist-soft'
  const rule = onDark ? 'border-cream/20' : 'border-rule'
  const tables = section.tables ?? []

  return (
    <Wrapper appearance={appearance}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} tone={tone} />

      <div className={`grid gap-8 ${tables.length > 1 ? 'lg:grid-cols-2' : 'max-w-4xl'}`}>
        {tables.map((table, i) => {
          const columns = table.columns ?? []
          return (
            <div key={table._key ?? i} className={`rounded-panel p-6 md:p-8 ${panel}`}>
              {table.title ? (
                <h3 className={`font-display text-2xl ${onDark ? 'text-cream' : 'text-lake'}`}>
                  {table.title}
                </h3>
              ) : null}
              {table.note ? <p className={`mt-1 text-sm ${muted}`}>{table.note}</p> : null}

              {/* Wide tables scroll inside their panel on a phone rather than
                  pushing the page sideways. */}
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[22rem] border-collapse text-left text-base">
                  {table.title ? <caption className="sr-only">{table.title}</caption> : null}
                  {columns.length ? (
                    <thead>
                      <tr className={`border-b-2 ${rule}`}>
                        {columns.map((col, c) => (
                          <th
                            key={c}
                            scope="col"
                            className={`py-3 pr-4 text-sm font-semibold ${muted} ${c > 0 ? 'text-right' : ''}`}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  ) : null}
                  <tbody>
                    {(table.rows ?? []).map((row, r) => (
                      <tr key={row._key ?? r} className={`border-b border-dashed ${rule}`}>
                        {(row.cells ?? []).map((cell, c) =>
                          c === 0 ? (
                            <th key={c} scope="row" className="py-3 pr-4 font-normal">
                              {cell}
                            </th>
                          ) : (
                            <td key={c} className="whitespace-nowrap py-3 pr-4 text-right font-semibold last:pr-0">
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>

      {footnote ? <p className={`mt-6 max-w-[70ch] whitespace-pre-line text-sm ${muted}`}>{footnote}</p> : null}
      <ButtonRow buttons={buttons} settings={settings} tone={tone} className="mt-8" />
    </Wrapper>
  )
}

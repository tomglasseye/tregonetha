import {useEffect} from 'react'
import type {CampsuiteSection, SiteSettings} from '~/types'
import {ButtonRow} from '../ui/Button'
import {Section as Wrapper} from '../ui/Section'
import {SectionHeader} from './SectionHeader'
import {opt} from '~/lib/stega'

/** The park's CampSuite address: bookings.campsuite.net/<park>/availability */
export const CAMPSUITE_PARK = 'tregonetha-lake'
export const CAMPSUITE_BOOKING_URL = `https://bookings.campsuite.net/${CAMPSUITE_PARK}/availability`
const WIDGET_SRC = 'https://bookings.campsuite.net/js/widget.js'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'campsuite-availability': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {park: string; layout?: string; accommodation?: string}
    }
  }
}

/**
 * Loads CampSuite's widget script once per visit, only on pages that show it.
 * It defines <campsuite-availability>, which upgrades any element already on
 * the page and any React adds later on client-side navigation.
 */
function useCampsuiteScript() {
  useEffect(() => {
    if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) return
    const s = document.createElement('script')
    s.src = WIDGET_SRC
    s.async = true
    s.dataset.cfasync = 'false'
    document.body.appendChild(s)
  }, [])
}

function Widget({layout, typeId}: {layout?: string; typeId?: number}) {
  const href = typeId
    ? `${CAMPSUITE_BOOKING_URL}?kind=accommodation&type=${typeId}`
    : CAMPSUITE_BOOKING_URL
  return (
    <campsuite-availability
      park={CAMPSUITE_PARK}
      {...(layout && layout !== 'search' ? {layout} : {})}
      {...(typeId ? {accommodation: String(typeId)} : {})}
    >
      {/* Shown until the script runs, and if it never does. */}
      <a href={href} className="font-semibold text-teal underline underline-offset-4">
        Check availability
      </a>
    </campsuite-availability>
  )
}

export function Campsuite({section, settings}: {section: CampsuiteSection; settings?: SiteSettings}) {
  useCampsuiteScript()
  const {eyebrow, heading, intro, buttons, appearance} = section
  const tone = opt(appearance?.tone)
  const layout = opt(section.layout) ?? 'search'
  const calendars = (section.calendars ?? []).filter((c) => c.typeId)

  return (
    <Wrapper appearance={appearance}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} tone={tone} />

      {calendars.length ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {calendars.map((c) => (
            <div key={c._key}>
              <h3 className="mb-3 text-lg font-bold">{c.label}</h3>
              <Widget layout="calendar" typeId={c.typeId} />
            </div>
          ))}
        </div>
      ) : (
        // The widget draws its own card, so no panel around it here.
        <Widget layout={layout} />
      )}

      <ButtonRow buttons={buttons} settings={settings} tone={tone} className="mt-6" />
    </Wrapper>
  )
}

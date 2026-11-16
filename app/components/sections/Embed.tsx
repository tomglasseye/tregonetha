import type {EmbedSection, SiteSettings} from '~/types'
import {ButtonRow} from '../ui/Button'
import {Section as Wrapper} from '../ui/Section'
import {SectionHeader} from './SectionHeader'
import {opt} from '~/lib/stega'

/**
 * A booking system or calendar in a frame: CampSuite, Calendly, Catch.
 *
 * Only https addresses render. The sandbox allows what booking widgets need
 * (their own scripts, forms, payment pop-ups) and nothing that would let the
 * frame reach into this page: the provider runs on its own origin.
 */
export function Embed({section, settings}: {section: EmbedSection; settings?: SiteSettings}) {
  const {eyebrow, heading, intro, buttons, appearance} = section
  const tone = opt(appearance?.tone)
  const src = opt(section.embedUrl)
  const safe = src && /^https:\/\//i.test(src) ? src : null
  const height = Math.min(Math.max(section.height ?? 760, 300), 2000)

  return (
    <Wrapper appearance={appearance}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} tone={tone} />

      {safe ? (
        <div className="overflow-hidden rounded-panel bg-white shadow-sm ring-1 ring-black/5">
          <iframe
            src={safe}
            title={section.title || 'Online booking'}
            loading="lazy"
            style={{height}}
            className="block w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="payment"
          />
        </div>
      ) : null}

      <ButtonRow buttons={buttons} settings={settings} tone={tone} className={safe ? 'mt-6' : ''} />
    </Wrapper>
  )
}

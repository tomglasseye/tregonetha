import type {CallToActionSection, SiteSettings} from '~/types'
import {ButtonRow} from '../ui/Button'
import {Section as Wrapper} from '../ui/Section'
import {opt} from '~/lib/stega'

/**
 * The band that was hand-repeated on nine of the eleven old pages.
 * `urgent` covers the separate 24-hour emergency call-out block.
 */
export function CallToAction({section, settings}: {section: CallToActionSection; settings?: SiteSettings}) {
  const {heading, body, buttons, showPhone, appearance} = section
  const urgent = opt(section.tone) === 'urgent'
  const panelTone = opt(appearance?.tone)
  const phone = settings?.emergencyPhone || settings?.phone

  // The panel sets its own ground, so text colour follows the PANEL, not the
  // section tone. Getting this wrong is how you end up with lake on lake.
  const onDarkPanel = urgent || panelTone === 'lake'
  const panel = urgent
    ? 'bg-ember-ink text-cream'
    : panelTone === 'lake'
      ? 'bg-lake text-cream'
      : 'bg-mist text-lake'

  return (
    // `tone` here means "panel colour", not "section background" — the panel
    // already carries it, so the section itself stays on the plain page
    // ground. Painting the section the same tone too would leave the panel
    // with nothing to contrast against. Spacing keeps its old fixed value
    // unless an editor has actually set one, since that field was inert here
    // before this migration.
    <Wrapper
      appearance={{...appearance, tone: undefined, spacing: appearance?.spacing ?? 'tight'}}
      grainSeed={section._key}
    >
      <div className={`rounded-panel px-6 py-12 md:px-14 md:py-16 ${panel}`}>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            {urgent ? (
              <p className="u-eyebrow mb-4 text-cream/80">24 hours a day, 365 days a year</p>
            ) : null}
            <h2 className={`u-h3 max-w-[24ch] ${onDarkPanel ? 'text-cream' : 'text-lake'}`}>
              {heading}
            </h2>
            {body ? (
              <p
                className={`mt-5 max-w-[62ch] ${
                  onDarkPanel ? 'text-cream/85' : 'text-lake/75'
                }`}
              >
                {body}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            {showPhone && phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className={`font-display text-3xl no-underline transition-opacity hover:opacity-80 ${
                  onDarkPanel ? 'text-cream' : 'text-lake'
                }`}
              >
                {phone}
              </a>
            ) : null}
            <ButtonRow
              buttons={buttons}
              settings={settings}
              tone={onDarkPanel ? 'lake' : undefined}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

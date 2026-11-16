import type {RichTextSection} from '~/types'
import {Prose} from '../ui/Prose'
import {Section as Wrapper} from '../ui/Section'
import {opt} from '~/lib/stega'

export function RichText({section}: {section: RichTextSection}) {
  const {heading, body, appearance} = section
  const width = opt(section.width) ?? 'narrow'
  const onDark = opt(appearance?.tone) === 'lake'

  return (
    <Wrapper appearance={appearance} grainSeed={section._key}>
      <div className={width === 'narrow' ? 'max-w-[68ch]' : 'max-w-[90ch]'}>
        {heading ? (
          <h2 className={`u-h3 mb-6 ${onDark ? 'text-cream' : 'text-lake'}`}>{heading}</h2>
        ) : null}
        <Prose value={body} className={onDark ? 'text-cream/85' : 'text-ink'} />
      </div>
    </Wrapper>
  )
}

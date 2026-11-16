import {defineType, defineField} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

/**
 * A booking system or calendar shown inside the page: CampSuite for stays,
 * Calendly for wedding viewings, Catch for fishing tickets.
 *
 * Only an https address is accepted, shown in a sandboxed frame. Pasting raw
 * script snippets into the CMS would let anyone with Studio access run code on
 * the site, so if a provider only gives a <script> snippet, that gets added in
 * code instead.
 */
export const embed = defineType({
  name: 'embed',
  title: 'Booking / calendar embed',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'intro', type: 'text', rows: 2}),
    defineField({
      name: 'embedUrl',
      title: 'Embed address',
      type: 'url',
      description:
        'The https address the booking provider gives for embedding, e.g. the CampSuite booking widget or a Calendly link. Leave blank to show just the button below.',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'height',
      title: 'Height (pixels)',
      type: 'number',
      initialValue: 760,
      validation: (r) => r.min(300).max(2000),
    }),
    defineField({
      name: 'title',
      title: 'Frame title',
      type: 'string',
      initialValue: 'Online booking',
      description: 'Read out by screen readers, e.g. "Book a camping pitch".',
    }),
    defineField({
      name: 'buttons',
      type: 'array',
      of: [{type: 'cta'}],
      description: 'e.g. "Open booking in a new tab" — useful on phones.',
      validation: (r) => r.max(2),
    }),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {title: 'heading', url: 'embedUrl'},
    prepare: ({title, url}) => ({
      title: title || 'Booking embed',
      subtitle: url ? `Embed — ${new URL(url).hostname}` : 'Embed — no address yet',
    }),
  },
})

import {defineType, defineField} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

/**
 * What's On. Lists upcoming Event documents automatically — past events drop
 * off the day after they finish, so the page never needs tidying.
 */
export const events = defineType({
  name: 'events',
  title: "What's on",
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', initialValue: "What's on"}),
    defineField({name: 'intro', type: 'text', rows: 2}),
    defineField({
      name: 'limit',
      title: 'How many to show',
      type: 'number',
      initialValue: 6,
      validation: (r) => r.min(1).max(20),
    }),
    defineField({
      name: 'emptyMessage',
      title: 'Message when nothing is booked',
      type: 'string',
      initialValue: 'New dates coming soon — follow us for live music and events.',
    }),
    defineField({name: 'buttons', type: 'array', of: [{type: 'cta'}], validation: (r) => r.max(2)}),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || "What's on", subtitle: 'Upcoming events, automatic'}),
  },
})

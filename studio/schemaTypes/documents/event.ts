import {defineType, defineField} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

/** A live music night, quiz, pop-up or other event at Wildfire. */
export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'startDate', title: 'Date', type: 'date', validation: (r) => r.required()}),
    defineField({
      name: 'endDate',
      title: 'Ends (if more than one day)',
      type: 'date',
      validation: (r) =>
        r.custom((end, ctx) => {
          const start = (ctx.document as any)?.startDate
          return !end || !start || end >= start ? true : 'Ends before it starts'
        }),
    }),
    defineField({name: 'time', type: 'string', description: 'e.g. "7pm – 10pm"'}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'image', type: 'figure'}),
    defineField({name: 'button', type: 'cta', description: 'Optional, e.g. "Get tickets".'}),
  ],
  orderings: [
    {title: 'Date', name: 'dateAsc', by: [{field: 'startDate', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', date: 'startDate', time: 'time', media: 'image'},
    prepare: ({title, date, time, media}) => ({
      title,
      subtitle: [date, time].filter(Boolean).join(' · '),
      media,
    }),
  },
})

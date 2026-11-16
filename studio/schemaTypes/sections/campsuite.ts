import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

/**
 * CampSuite's live availability widget, shown in the page with the site's own
 * fonts and colours. Guests search here and finish booking on CampSuite.
 *
 * The widget script is loaded in code (app/components/sections/Campsuite.tsx),
 * never pasted into the CMS: editors pick a layout, nothing more.
 */
export const campsuite = defineType({
  name: 'campsuite',
  title: 'CampSuite availability',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'intro', type: 'text', rows: 2}),
    defineField({
      name: 'layout',
      type: 'string',
      initialValue: 'search',
      options: {
        list: [
          {title: 'Search and results: dates, what is free, photos and prices', value: 'search'},
          {title: 'Search bar: a slim bar that opens the booking page', value: 'bar'},
          {title: 'Month calendar: tap an arrival day, then book', value: 'calendar'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'calendars',
      title: 'One calendar per accommodation type',
      description:
        'Optional. Shows a separate month calendar for each type listed, side by side. Leave empty for the whole park. The type number is in CampSuite → Website snippets → For each accommodation.',
      type: 'array',
      hidden: ({parent}) => parent?.layout !== 'calendar',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'campsuiteUnit',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'typeId',
              title: 'CampSuite type number',
              type: 'number',
              validation: (r) => r.required().integer().positive(),
            }),
          ],
          preview: {
            select: {title: 'label', id: 'typeId'},
            prepare: ({title, id}) => ({title, subtitle: id ? `Type ${id}` : 'No type yet'}),
          },
        }),
      ],
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'buttons',
      type: 'array',
      of: [{type: 'cta'}],
      validation: (r) => r.max(2),
    }),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {title: 'heading', layout: 'layout', calendars: 'calendars'},
    prepare: ({title, layout, calendars}) => ({
      title: title || 'CampSuite availability',
      subtitle: `CampSuite: ${
        calendars?.length ? `${calendars.length} calendars` : layout || 'search'
      }`,
    }),
  },
})

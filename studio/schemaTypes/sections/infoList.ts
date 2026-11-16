import {defineType, defineField, defineArrayMember} from 'sanity'
import {ClockIcon} from '@sanity/icons/Clock'

/**
 * Label / value pairs. Opening times, which camping areas are open when,
 * parking and directions, what is included — anything that reads as a list of
 * facts rather than paragraphs.
 */
export const infoList = defineType({
  name: 'infoList',
  title: 'Details list',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'intro', type: 'text', rows: 3}),
    defineField({
      name: 'layout',
      type: 'string',
      initialValue: 'rows',
      options: {
        list: [
          {title: 'Rows (label left, detail right)', value: 'rows'},
          {title: 'Cards', value: 'cards'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'infoItem',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              description: 'e.g. "Lake Field" or "Friday"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'value',
              type: 'string',
              description: 'e.g. "26 March – end of October" or "12pm – 10pm"',
            }),
            defineField({name: 'note', type: 'text', rows: 2, description: 'Optional extra line.'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({name: 'buttons', type: 'array', of: [{type: 'cta'}], validation: (r) => r.max(2)}),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare: ({title, items}) => ({
      title: title || 'Details list',
      subtitle: `Details list — ${items?.length ?? 0} item(s)`,
    }),
  },
})

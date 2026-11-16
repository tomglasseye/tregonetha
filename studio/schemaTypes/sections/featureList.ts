import {defineType, defineField} from 'sanity'
import {ThListIcon} from '@sanity/icons/ThList'

/**
 * The most important section in the schema.
 *
 * Any repeating "heading + body + image" run: the bell tents, the pegs, the
 * wedding inclusions. One type, four layouts.
 */
export const featureList = defineType({
  name: 'featureList',
  title: 'Feature list',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'intro', type: 'text', rows: 3}),
    defineField({
      name: 'layout',
      type: 'string',
      initialValue: 'alternating',
      options: {
        list: [
          {title: 'Alternating rows (image left / right)', value: 'alternating'},
          {title: 'Numbered columns (01 / 02 / 03)', value: 'numbered'},
          {title: 'Card grid', value: 'cards'},
          {title: 'Compact list (no images)', value: 'compact'},
        ],
      },
      description:
        'Alternating suits a run of photo + text blocks (the bell tents). Cards suit an overview. Compact suits a list with short descriptions.',
    }),
    defineField({
      name: 'items',
      type: 'array',
      validation: (r) => r.min(1),
      of: [
        {
          type: 'object',
          name: 'feature',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'body',
              type: 'array',
              of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}]}],
            }),
            defineField({name: 'image', type: 'figure'}),
            defineField({
              name: 'button',
              type: 'cta',
              description: 'Optional — e.g. "Contact us" on a single service.',
            }),
          ],
          preview: {select: {title: 'title', media: 'image'}},
        },
      ],
    }),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {title: 'heading', layout: 'layout', items: 'items'},
    prepare: ({title, layout, items}) => ({
      title: title || 'Feature list',
      subtitle: `Feature list — ${layout}, ${items?.length ?? 0} item(s)`,
    }),
  },
})

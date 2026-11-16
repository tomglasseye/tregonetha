import {defineType, defineField} from 'sanity'
import {BlockContentIcon} from '@sanity/icons/BlockContent'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'layout',
      type: 'string',
      initialValue: 'panel',
      options: {
        list: [
          {title: 'Photo left, sage panel right (home, camping)', value: 'panel'},
          {title: 'Full-width photo, logo and text centred (homepage)', value: 'full'},
          {title: 'Photo banner, title bottom left (inner pages)', value: 'banner'},
          {title: 'Split — text beside image', value: 'split'},
          {title: 'Text only', value: 'text'},
        ],
      },
    }),
    defineField({
      name: 'showLogo',
      title: 'Show the logo',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}) => parent?.layout !== 'full',
      description: 'Shows the logo from Site settings above the heading.',
    }),
    defineField({
      name: 'eyebrow',
      type: 'string',
      description:
        'Small label. Above the heading, e.g. "Open all year round". Under it on the full-width hero.',
    }),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'standfirst',
      title: 'Standfirst',
      type: 'text',
      rows: 3,
      description: 'The line under the heading. e.g. "Open all year round, with different camping options through the seasons."',
    }),
    defineField({
      name: 'image',
      type: 'figure',
      hidden: ({parent}) => parent?.layout === 'text',
    }),
    defineField({name: 'buttons', type: 'array', of: [{type: 'cta'}], validation: (r) => r.max(2)}),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'standfirst', media: 'image'},
    prepare: ({title, subtitle, media}) => ({title: title || 'Hero', subtitle: `Hero — ${subtitle || ''}`, media}),
  },
})

import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

/**
 * Recent catches. Lists the newest Catch reports automatically; the section
 * stays hidden until there is at least one, so it can go on a page early.
 */
export const catches = defineType({
  name: 'catches',
  title: 'Recent catches',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string', initialValue: 'From the bank'}),
    defineField({name: 'heading', type: 'string', initialValue: 'Recent catches'}),
    defineField({name: 'intro', type: 'text', rows: 2}),
    defineField({
      name: 'carpOnly',
      title: 'Carp only',
      type: 'boolean',
      initialValue: false,
      description: 'For the carp fishing page: leave out roach, bream and the rest.',
    }),
    defineField({
      name: 'limit',
      title: 'How many to show',
      type: 'number',
      initialValue: 6,
      validation: (r) => r.min(1).max(12),
    }),
    defineField({name: 'buttons', type: 'array', of: [{type: 'cta'}], validation: (r) => r.max(2)}),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {title: 'heading', carpOnly: 'carpOnly'},
    prepare: ({title, carpOnly}) => ({
      title: title || 'Recent catches',
      subtitle: carpOnly ? 'Latest carp, automatic' : 'Latest catch reports, automatic',
    }),
  },
})

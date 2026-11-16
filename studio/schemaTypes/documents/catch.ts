import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const SPECIES = [
  'Common carp',
  'Mirror carp',
  'Ghost carp',
  'Tench',
  'Bream',
  'Roach',
  'Rudd',
  'Perch',
  'Other',
] as const

/**
 * A catch report: one photo of a fish caught on the lake. The newest ones show
 * in any "Recent catches" section, so adding one here updates every fishing
 * page at once. Quick enough to do from a phone on the bank.
 */
export const catchReport = defineType({
  name: 'catchReport',
  title: 'Catch report',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'photo',
      type: 'figure',
      description: 'The fish, ideally with the angler kneeling on the unhooking mat.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'species',
      type: 'string',
      options: {list: [...SPECIES]},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'weight',
      type: 'string',
      description: 'As anglers say it, e.g. "17lb 4oz". Leave blank if it wasn\'t weighed.',
    }),
    defineField({
      name: 'date',
      title: 'Date caught',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'angler',
      type: 'string',
      description: 'First name only, and only with their OK.',
    }),
    defineField({
      name: 'note',
      type: 'string',
      description: 'Optional, e.g. "Peg 4, night session, pop-up".',
    }),
  ],
  orderings: [{title: 'Newest', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {species: 'species', weight: 'weight', date: 'date', angler: 'angler', media: 'photo'},
    prepare: ({species, weight, date, angler, media}) => ({
      title: [weight, species].filter(Boolean).join(' ') || 'Catch',
      subtitle: [date, angler].filter(Boolean).join(' · '),
      media,
    }),
  },
})

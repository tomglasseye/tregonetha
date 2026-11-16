import {defineType, defineField, defineArrayMember} from 'sanity'
import {ThLargeIcon} from '@sanity/icons/ThLarge'

/** Keep in step with ICON_NAMES in app/components/ui/LineIcon.tsx. */
export const ICON_OPTIONS = [
  {title: 'Tent (camping & glamping)', value: 'tent'},
  {title: 'Fish (fishing)', value: 'fish'},
  {title: 'Knife & fork (bar & kitchen)', value: 'cutlery'},
  {title: 'Rings (weddings)', value: 'rings'},
  {title: 'Leaf (sustainability)', value: 'leaf'},
  {title: 'Calendar', value: 'calendar'},
  {title: 'Map pin', value: 'pin'},
  {title: 'Envelope', value: 'mail'},
  {title: 'Phone', value: 'phone'},
  {title: 'Star', value: 'star'},
]

/** The row of symbols under the hero, one per main page. */
export const iconNav = defineType({
  name: 'iconNav',
  title: 'Icon links',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'items',
      type: 'array',
      validation: (r) => r.min(2).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'iconNavItem',
          fields: [
            defineField({name: 'icon', type: 'string', options: {list: ICON_OPTIONS}, validation: (r) => r.required()}),
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'sublabel', type: 'string', description: 'Optional second line, e.g. "Lakeside Venue".'}),
            defineField({
              name: 'page',
              title: 'Links to',
              type: 'reference',
              to: [{type: 'page'}],
              validation: (r) => r.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'sublabel'}},
        }),
      ],
    }),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {items: 'items'},
    prepare: ({items}) => ({title: 'Icon links', subtitle: `${items?.length ?? 0} link(s)`}),
  },
})

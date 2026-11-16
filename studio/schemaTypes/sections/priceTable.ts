import {defineType, defineField, defineArrayMember} from 'sanity'
import {ThListIcon} from '@sanity/icons/ThList'

/**
 * Price tables: camping by date band, bell tents by season, fishing tickets.
 * One section can hold several tables so a whole price list sits together.
 *
 * Cells are plain text on purpose ("£12.50", "2 nights min", "—"), so Mel can
 * type whatever a column needs without a developer adding fields.
 */
export const priceTable = defineType({
  name: 'priceTable',
  title: 'Price table',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'intro', type: 'text', rows: 2}),
    defineField({
      name: 'tables',
      type: 'array',
      validation: (r) => r.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'table',
          fields: [
            defineField({name: 'title', type: 'string', description: 'e.g. "Camping, 2027"'}),
            defineField({
              name: 'note',
              type: 'string',
              description: 'Shown under the title, e.g. "Per person, per night".',
            }),
            defineField({
              name: 'columns',
              title: 'Column headings',
              type: 'array',
              of: [{type: 'string'}],
              description: 'e.g. Dates · Adult · Child (under 15)',
              validation: (r) => r.min(1).max(6),
            }),
            defineField({
              name: 'rows',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'row',
                  fields: [
                    defineField({
                      name: 'cells',
                      type: 'array',
                      of: [{type: 'string'}],
                      description: 'One entry per column, in the same order as the headings.',
                    }),
                  ],
                  preview: {
                    select: {cells: 'cells'},
                    prepare: ({cells}) => ({title: (cells ?? []).join('  ·  ') || 'Empty row'}),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'title', note: 'note', rows: 'rows'},
            prepare: ({title, note, rows}) => ({
              title: title || 'Table',
              subtitle: [note, `${rows?.length ?? 0} row(s)`].filter(Boolean).join(' — '),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'footnote',
      type: 'text',
      rows: 2,
      description: 'Small print under the tables, e.g. "Fishing is not included with camping."',
    }),
    defineField({name: 'buttons', type: 'array', of: [{type: 'cta'}], validation: (r) => r.max(2)}),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {title: 'heading', tables: 'tables'},
    prepare: ({title, tables}) => ({
      title: title || 'Price table',
      subtitle: `Price table — ${(tables ?? []).map((t: any) => t.title).filter(Boolean).join(', ')}`,
    }),
  },
})

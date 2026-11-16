import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Food and drink menus for Wildfire. Each menu can be typed in, uploaded as a
 * PDF, or both — typed menus are better for search and phones, a PDF is
 * quicker when the menu changes every week.
 */
export const menus = defineType({
  name: 'menus',
  title: 'Menus',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', initialValue: 'Food & drink'}),
    defineField({name: 'intro', type: 'text', rows: 2}),
    defineField({
      name: 'menus',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menu',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'note', type: 'string', description: 'e.g. "Served 12pm – 8pm"'}),
            defineField({
              name: 'file',
              title: 'PDF menu',
              type: 'file',
              options: {accept: 'application/pdf'},
              description: 'Optional. Shows a "Download the menu" link.',
            }),
            defineField({
              name: 'groups',
              title: 'Menu sections',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'menuGroup',
                  fields: [
                    defineField({name: 'heading', type: 'string', description: 'e.g. "Pizzas"'}),
                    defineField({
                      name: 'items',
                      type: 'array',
                      of: [
                        defineArrayMember({
                          type: 'object',
                          name: 'menuItem',
                          fields: [
                            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
                            defineField({name: 'description', type: 'string'}),
                            defineField({name: 'price', type: 'string', description: 'e.g. "£12"'}),
                            defineField({
                              name: 'dietary',
                              type: 'string',
                              description: 'e.g. "V", "VG", "GF"',
                            }),
                          ],
                          preview: {select: {title: 'name', subtitle: 'price'}},
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: {title: 'heading', items: 'items'},
                    prepare: ({title, items}) => ({
                      title: title || 'Menu section',
                      subtitle: `${items?.length ?? 0} item(s)`,
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'note'}},
        }),
      ],
    }),
    defineField({
      name: 'footnote',
      type: 'text',
      rows: 2,
      description: 'e.g. allergen information.',
    }),
    defineField({name: 'appearance', type: 'sectionAppearance'}),
  ],
  preview: {
    select: {title: 'heading', menus: 'menus'},
    prepare: ({title, menus}) => ({
      title: title || 'Menus',
      subtitle: `Menus — ${(menus ?? []).map((m: any) => m.title).join(', ')}`,
    }),
  },
})

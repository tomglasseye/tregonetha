import {defineType, defineField} from 'sanity'
import {MenuIcon} from '@sanity/icons/Menu'

/** Singleton. Header menu, footer columns, and the header CTA. */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'headerLinks',
      title: 'Header menu',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'link', type: 'link', validation: (r) => r.required()}),
            defineField({
              name: 'showInBar',
              title: 'Show in the top bar',
              type: 'boolean',
              initialValue: false,
              description:
                'Every link appears in the menu overlay. Tick this for the few that also sit across the header on desktop — five short ones is the limit before the bar can no longer sit centred.',
            }),
            defineField({
              name: 'barLabel',
              title: 'Shorter label for the top bar',
              type: 'string',
              description:
                'Optional. Shown in the top bar instead of the label above, which the menu overlay keeps — e.g. "Wildfire" for "Wildfire Lakeside Bar & Kitchen".',
              hidden: ({parent}) => !parent?.showInBar,
            }),
            defineField({
              name: 'children',
              title: 'Dropdown items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'childItem',
                  fields: [
                    defineField({name: 'label', type: 'string'}),
                    defineField({name: 'link', type: 'link'}),
                  ],
                  preview: {select: {title: 'label'}},
                },
              ],
            }),
          ],
          preview: {
            select: {title: 'label', children: 'children', showInBar: 'showInBar'},
            prepare: ({title, children, showInBar}) => ({
              title,
              subtitle: [
                showInBar ? 'in top bar' : null,
                children?.length ? `${children.length} sub-item(s)` : null,
              ]
                .filter(Boolean)
                .join(' · '),
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'headerCta',
      title: 'Header button',
      type: 'cta',
      description: 'The persistent button in the header, e.g. "Get a quote".',
    }),
    defineField({
      name: 'footerColumns',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({name: 'heading', type: 'string'}),
            defineField({
              name: 'links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'footerLink',
                  fields: [
                    defineField({name: 'label', type: 'string'}),
                    defineField({name: 'link', type: 'link'}),
                  ],
                  preview: {select: {title: 'label'}},
                },
              ],
            }),
          ],
          preview: {
            select: {title: 'heading', links: 'links'},
            prepare: ({title, links}) => ({title, subtitle: `${links?.length ?? 0} link(s)`}),
          },
        },
      ],
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'legalLink',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({name: 'link', type: 'link'}),
          ],
          preview: {select: {title: 'label'}},
        },
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Navigation'})},
})

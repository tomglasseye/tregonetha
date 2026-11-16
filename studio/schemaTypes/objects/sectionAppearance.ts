import {defineType, defineField} from 'sanity'

/**
 * Shared by every section. Lets the page-builder set colour rhythm and spacing
 * without a developer. Values map onto the Tailwind @theme tokens.
 */
export const sectionAppearance = defineType({
  name: 'sectionAppearance',
  title: 'Appearance',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'tone',
      title: 'Background',
      type: 'string',
      initialValue: 'cream',
      options: {
        list: [
          {title: 'Cream (page default)', value: 'cream'},
          {title: 'Mist (pale green panel)', value: 'mist'},
          {title: 'Lake (dark green panel)', value: 'lake'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'spacing',
      title: 'Vertical space',
      type: 'string',
      initialValue: 'normal',
      options: {
        list: [
          {title: 'Normal', value: 'normal'},
          {title: 'Tight', value: 'tight'},
          {title: 'None (butt up against the next section)', value: 'none'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'pattern',
      title: 'Background pattern',
      type: 'string',
      initialValue: 'none',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Wavy lines', value: 'lines'},
        ],
        layout: 'radio',
      },
      description: 'Faint flowing lines behind the section, like the homepage photo. Use sparingly.',
    }),
    defineField({
      name: 'waveEdge',
      title: 'Wavy bottom edge',
      type: 'boolean',
      initialValue: true,
      description:
        'The section\'s bottom edge waves into the next one. Only shows when the next section is a different colour.',
    }),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
      description: 'Optional. Lets a link jump to this section, e.g. "prices". Links to "#prices" then scroll straight here.',
    }),
  ],
})

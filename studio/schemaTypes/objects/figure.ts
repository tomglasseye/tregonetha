import {defineType, defineField} from 'sanity'

/**
 * Every image on the site goes through here so alt text is never optional.
 * Alt text is required unless the image is ticked as decorative.
 */
export const figure = defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe the image for screen readers and search engines. e.g. "Bell tents on the lake bank at sunset". Leave blank ONLY if the image is purely decorative.',
      validation: (r) =>
        r.custom((v, ctx) =>
          (ctx.parent as any)?.decorative || v ? true : 'Add alt text, or tick "decorative"',
        ),
    }),
    defineField({name: 'decorative', title: 'Decorative only', type: 'boolean', initialValue: false}),
    defineField({name: 'caption', type: 'string'}),
    defineField({
      name: 'placeholder',
      title: 'Placeholder image',
      type: 'boolean',
      description:
        'Set by scripts/seed-placeholder-image.mjs. Replace this image with a real photo and untick.',
      initialValue: false,
      readOnly: true,
      hidden: ({value}) => !value,
    }),
  ],
  preview: {
    select: {media: 'asset', title: 'alt', subtitle: 'caption', placeholder: 'placeholder'},
    prepare: ({media, title, subtitle, placeholder}) => ({
      media,
      title: placeholder ? 'Placeholder image' : (title ?? 'Image'),
      subtitle: placeholder ? 'Replace with a real photo' : subtitle,
    }),
  },
})

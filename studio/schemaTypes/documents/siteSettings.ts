import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

/**
 * Singleton. The contact details were hand-repeated on all eleven old pages —
 * here they live once.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'business', title: 'Business', default: true},
    {name: 'contact', title: 'Contact'},
    {name: 'social', title: 'Social'},
    {name: 'seo', title: 'Defaults'},
  ],
  fields: [
    defineField({
      name: 'businessName',
      type: 'string',
      group: 'business',
      initialValue: 'Tregonetha Lake',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      type: 'image',
      group: 'business',
      description: 'The round Tregonetha Lake mark, in white on transparent (SVG or PNG). Used in the header, the homepage hero and the footer.',
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      group: 'business',
      initialValue: 'Fishing · Camping · Glamping',
    }),
    defineField({name: 'companyNumber', type: 'string', group: 'business'}),
    defineField({
      name: 'phone',
      title: 'Main phone',
      type: 'string',
      group: 'contact',
      initialValue: '07974 937649',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'phoneLabel',
      type: 'string',
      group: 'contact',
      initialValue: 'Mel',
      description: 'Shown as "Call Mel: 07974 937649". Leave blank for just "Call 07974 937649".',
    }),
    defineField({name: 'secondaryPhone', type: 'string', group: 'contact'}),
    defineField({name: 'secondaryPhoneLabel', type: 'string', group: 'contact'}),
    defineField({
      name: 'emergencyPhone',
      type: 'string',
      group: 'contact',
      hidden: true,
    }),
    defineField({
      name: 'email',
      type: 'string',
      group: 'contact',
      initialValue: 'tregonethalake@gmail.com',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'address',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({name: 'line1', type: 'string', initialValue: 'Avalen Farm'}),
        defineField({name: 'line2', type: 'string', initialValue: 'Tregonetha'}),
        defineField({name: 'town', type: 'string', initialValue: 'St Columb'}),
        defineField({name: 'county', type: 'string', initialValue: 'Cornwall'}),
        defineField({name: 'postcode', type: 'string', initialValue: 'TR9 6EN'}),
      ],
    }),
    defineField({
      name: 'serviceArea',
      type: 'string',
      group: 'contact',
      initialValue: 'Cornwall',
      description: 'Used in LocalBusiness structured data.',
    }),
    defineField({
      name: 'areasServed',
      title: 'Towns we cover',
      type: 'array',
      of: [{type: 'string'}],
      group: 'contact',
      description:
        'Nearby places listed in the structured data, so Google can match the site to searches for them.',
    }),
    defineField({
      name: 'openingHours',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          name: 'hours',
          fields: [
            defineField({name: 'days', type: 'string'}),
            defineField({name: 'hours', type: 'string'}),
          ],
          preview: {select: {title: 'days', subtitle: 'hours'}},
        },
      ],
    }),
    defineField({
      name: 'instagramHandle',
      type: 'string',
      group: 'social',
      description: 'Without the @. Drives the follow link and an Instagram gallery, if used.',
    }),
    defineField({name: 'facebookUrl', type: 'url', group: 'social'}),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      description: 'Used when a page leaves its own SEO fields blank.',
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

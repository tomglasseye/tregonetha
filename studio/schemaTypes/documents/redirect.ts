import {defineType, defineField} from 'sanity'
import {ArrowRightIcon} from '@sanity/icons/ArrowRight'

/** Lower-case, no trailing slash — the form the site matches against. */
export const normalisePath = (value: string) => {
  const trimmed = value.trim().toLowerCase().replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

/**
 * Sends an old address to a new one, so links, bookmarks and Google rankings
 * survive when a page is moved or renamed. Checked before the site 404s.
 */
export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'from',
      title: 'Old address',
      type: 'string',
      description:
        'The address people used to visit, starting with a slash — e.g. /bell-tents. No domain, no ?query.',
      validation: (r) =>
        r.required().custom(async (value, ctx) => {
          if (!value) return true
          if (!value.startsWith('/')) return 'Must start with a slash, e.g. /bell-tents'
          if (/[\s?#]/.test(value)) return 'No spaces, ? or # — just the path'
          const path = normalisePath(value)
          if (path === '/') return 'The homepage cannot be redirected'
          if (path.startsWith('/studio')) return 'Reserved for the editing studio'
          const id = (ctx.document?._id ?? '').replace(/^drafts\./, '')
          const client = ctx.getClient({apiVersion: '2024-01-01'})
          const clash = await client.fetch<number>(
            `count(*[_type == "redirect" && lower(from) in [$a, $b] && !(_id in [$id, "drafts." + $id])])`,
            {a: path, b: `${path}/`, id},
          )
          if (clash) return 'There is already a redirect from this address'
          const page = await client.fetch<number>(
            `count(*[_type == "page" && "/" + slug.current == $path && !(_id in path("drafts.**"))])`,
            {path},
          )
          return page
            ? 'A live page already uses this address, so this redirect would hide it. Change the page address first.'
            : true
        }),
    }),
    defineField({
      name: 'to',
      title: 'New address',
      type: 'string',
      description:
        'Where to send them: a page on this site (e.g. /camping-glamping) or a full https:// link.',
      validation: (r) =>
        r.required().custom((value, ctx) => {
          if (!value) return true
          if (!/^(\/|https:\/\/)/.test(value)) return 'Start with a slash, or https://'
          if (/\s/.test(value)) return 'No spaces'
          const from = (ctx.document as any)?.from
          if (from && value.startsWith('/') && normalisePath(value) === normalisePath(from))
            return 'Cannot redirect to itself'
          return true
        }),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent move',
      type: 'boolean',
      initialValue: true,
      description:
        'Leave on for a page that has moved for good (tells Google to switch to the new address). Turn off for a temporary redirect, like an offer that ends.',
    }),
    defineField({
      name: 'note',
      title: 'Note (optional)',
      type: 'string',
      description: 'For your own reference — why this exists.',
    }),
  ],
  orderings: [{title: 'Old address', name: 'from', by: [{field: 'from', direction: 'asc'}]}],
  preview: {
    select: {from: 'from', to: 'to', permanent: 'permanent'},
    prepare: ({from, to, permanent}) => ({
      title: `${from ?? '?'}  →  ${to ?? '?'}`,
      subtitle: permanent === false ? 'Temporary (302)' : 'Permanent (301)',
    }),
  },
})

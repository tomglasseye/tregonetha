import {stegaClean} from '@sanity/client/stega'
import type {EventDoc, PageDoc, SanityImage, SiteSettings} from './types'
import {urlFor} from './sanity/image'

/**
 * Where the page lives, and whether search engines may index it — both come
 * from `seoContext()` in siteUrl.server.ts.
 */
export type SeoContext = {canonicalUrl?: string; indexable?: boolean}

/**
 * A crop of the image at exactly this size. `fit('crop')` with the focal point
 * matters: with only a width and a height the CDN shrinks the picture to fit
 * inside the box, so a square photo would come out 630 x 630 rather than the
 * 1200 x 630 the share tags promise.
 */
function shareImageUrl(image: unknown, width: number, height: number) {
  return urlFor(image as never)
    .width(width)
    .height(height)
    .fit('crop')
    .crop('focalpoint')
    .url()
}

/**
 * The page's first hero photo, if it has one. Used as the share picture when
 * no share image has been set in Studio, so links posted to Facebook or
 * WhatsApp always carry a picture without anyone having to remember to add one.
 */
export function heroImage(page?: PageDoc | null): SanityImage | undefined {
  const hero = page?.sections?.find((s) => s._type === 'hero') as
    | {image?: SanityImage}
    | undefined
  return hero?.image?.asset ? hero.image : undefined
}

/** Where the lake is, from the Google Maps listing. */
const GEO = {'@type': 'GeoCoordinates', latitude: 50.4439864, longitude: -4.8868606}

/** "07974 937649" → "+44 7974 937649": the international form Google asks for. */
function intlPhone(phone?: string) {
  if (!phone) return undefined
  const p = phone.trim()
  return p.startsWith('0') ? `+44 ${p.slice(1)}` : p
}

function postalAddress(settings?: SiteSettings) {
  const a = settings?.address
  if (!a) return undefined
  return {
    '@type': 'PostalAddress',
    streetAddress: [a.line1, a.line2].filter(Boolean).join(', '),
    addressLocality: a.town,
    addressRegion: a.county,
    postalCode: a.postcode,
    addressCountry: 'GB',
  }
}

/** Meta tags for a page, falling back to the site defaults from Studio. */
export function buildMeta(page?: PageDoc | null, settings?: SiteSettings, seo?: SeoContext) {
  // Everything here lands in <head>. Stega markers there would show up in
  // Google's snippet and in the browser tab, so strip them unconditionally —
  // there is nothing to click-to-edit inside a meta tag anyway.
  const business = stegaClean(settings?.businessName) ?? 'Tregonetha Lake'
  const title = stegaClean(
    page?.seo?.title || (page?.title ? `${page.title} | ${business}` : business),
  )
  const description = stegaClean(
    page?.seo?.description || settings?.seo?.description || settings?.tagline || '',
  )
  // Page's own share image, then its hero photo, then the site-wide default.
  const share = page?.seo?.shareImage?.asset
    ? page.seo.shareImage
    : (heroImage(page) ?? settings?.seo?.shareImage)
  const imageUrl = share?.asset ? shareImageUrl(share, 1200, 630) : undefined
  const imageAlt = stegaClean(share?.alt) || undefined

  const tags: Record<string, string>[] = [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:site_name', content: business},
    {property: 'og:locale', content: 'en_GB'},
    {name: 'twitter:card', content: imageUrl ? 'summary_large_image' : 'summary'},
  ]

  // One address per page. The redirect for trailing slashes lives in the root
  // loader; this tells search engines which URL to credit if a variant (a
  // tracking parameter, say) ever reaches them anyway.
  if (seo?.canonicalUrl) {
    tags.push({tagName: 'link', rel: 'canonical', href: seo.canonicalUrl})
    tags.push({property: 'og:url', content: seo.canonicalUrl})
  }

  if (imageUrl) {
    tags.push({property: 'og:image', content: imageUrl})
    tags.push({property: 'og:image:width', content: '1200'})
    tags.push({property: 'og:image:height', content: '630'})
    if (imageAlt) tags.push({property: 'og:image:alt', content: imageAlt})
  }

  // Kept out of search results when Studio says so, or when this isn't the
  // public site at all (deploy previews, the netlify.app address, local dev).
  if (page?.seo?.noIndex || seo?.indexable === false) {
    tags.push({name: 'robots', content: 'noindex, nofollow'})
  }

  return tags
}

/**
 * Campground structured data (a LodgingBusiness, so a LocalBusiness too) —
 * absent from the old site, and one of the higher-leverage local SEO additions.
 */
export function localBusinessJsonLd(
  settings?: SiteSettings,
  siteUrl?: string,
  homepage?: PageDoc | null,
) {
  if (!settings) return null

  // Structured data is machine-read; stega would corrupt it.
  settings = stegaClean(settings) as SiteSettings

  // The site-wide share photo doubles as the business photo: one square and one
  // wide crop, which is what Google asks for. A real logo, once one is uploaded
  // in Studio, goes in `logo` — a photograph does not belong there.
  // Falls back to the homepage hero photo until a share image is set.
  const share = settings.seo?.shareImage?.asset ? settings.seo.shareImage : heroImage(homepage)
  const photos = share?.asset
    ? [shareImageUrl(share, 1200, 1200), shareImageUrl(share, 1200, 630)]
    : undefined

  const areas = [
    settings.serviceArea ? {'@type': 'AdministrativeArea', name: settings.serviceArea} : null,
    ...(settings.areasServed ?? []).map((name) => ({'@type': 'City', name})),
  ].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'Campground',
    // A stable identity for the business, so any other structured data on the
    // site can point at this node instead of describing it a second time.
    '@id': siteUrl ? `${siteUrl}/#business` : undefined,
    name: settings.businessName,
    description: settings.tagline,
    telephone: intlPhone(settings.phone),
    email: settings.email,
    url: siteUrl,
    // The GROQ projection yields null rather than undefined when nothing has
    // been uploaded, and JSON.stringify keeps null while dropping undefined —
    // so each of these falls back to undefined, never null.
    image: photos ?? settings.logoUrl ?? undefined,
    // An uploaded logo wins; until then the round mark that ships as the app
    // icon. Google wants a raster logo at least 112px square, which this is.
    logo: settings.logoUrl ?? (siteUrl ? `${siteUrl}/icon-512.png` : undefined),
    address: postalAddress(settings),
    geo: GEO,
    hasMap: 'https://www.google.com/maps/place/Tregonetha+Lake/@50.4439864,-4.8868606,15z',
    // What the site has, in the terms Google reads for campsites. Fixed facts
    // about the place rather than Studio content — edit here if they change.
    petsAllowed: true,
    amenityFeature: [
      'Two-acre carp and coarse fishing lake',
      'Day, night and 24-hour fishing tickets',
      'Lakeside bell tents',
      'Hot showers',
      'Compost toilets',
      'Lakeside bar and kitchen',
    ].map((name) => ({'@type': 'LocationFeatureSpecification', name, value: true})),
    containsPlace: {
      '@type': 'LakeBodyOfWater',
      name: 'Tregonetha Lake',
      description:
        'A two-acre lake with two peninsulas and two small islands, stocked with Common, Mirror and Ghost carp.',
    },
    areaServed: areas.length ? areas : undefined,
    openingHoursSpecification: settings.openingHours?.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      description: h.hours,
    })),
    sameAs: [
      settings.instagramHandle ? `https://instagram.com/${settings.instagramHandle}` : null,
      settings.facebookUrl ?? null,
    ].filter(Boolean),
  }
}

/**
 * Breadcrumb trail for a single page.
 *
 * Google uses this to replace the bare URL in a search result with a readable
 * trail, so it earns its place even though the site has no visible breadcrumb
 * UI and no nesting to describe — every page sits one level under the
 * homepage, and that is exactly what this says.
 *
 * Returns null for the homepage: a single-item trail describes nothing, and
 * Google discards it.
 */
export function breadcrumbJsonLd(page: PageDoc | null | undefined, siteUrl: string) {
  if (!page || page.isHomepage) return null

  // Same reason as above — stega markers are invisible characters that would
  // ride along into the breadcrumb text Google reads.
  const slug = stegaClean(page.slug)
  // seo.title is deliberately not used: it carries the "| Tregonetha Lake"
  // suffix meant for a browser tab, which would read as a duplicate inside a
  // trail that already starts at the site root.
  const name = stegaClean(page.title)
  if (!slug || !name) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/`},
      {'@type': 'ListItem', position: 2, name, item: `${siteUrl}/${slug}`},
    ],
  }
}

/**
 * What a page is, beyond "a page on the site" — set per page in Studio under
 * SEO → "This page is about". Wildfire is a bar in its own right, and the
 * weddings page describes the lake as a venue; each gets its own entity, tied
 * back to the business on the homepage by `@id`.
 */
export function pageEntityJsonLd(
  page: PageDoc | null | undefined,
  settings: SiteSettings | undefined,
  siteUrl: string | undefined,
) {
  const kind = stegaClean(page?.schemaType)
  if (!page || !siteUrl || !kind || page.isHomepage) return null
  settings = stegaClean(settings) as SiteSettings | undefined

  const slug = stegaClean(page.slug)
  const url = `${siteUrl}/${slug}`
  const photo = page.seo?.shareImage?.asset ? page.seo.shareImage : heroImage(page)
  const image = photo ? [shareImageUrl(photo, 1200, 1200), shareImageUrl(photo, 1200, 630)] : undefined
  const description = stegaClean(page.seo?.description) || undefined
  const business = settings?.businessName
  const parent = {'@id': `${siteUrl}/#business`}

  if (kind === 'BarOrPub') {
    // A menu the guest can download beats pointing back at the page itself.
    const menus = page.sections?.find((s) => s._type === 'menus') as
      | {menus?: {fileUrl?: string | null}[] | null}
      | undefined
    const menuFile = menus?.menus?.find((m) => m.fileUrl)?.fileUrl
    return {
      '@context': 'https://schema.org',
      '@type': 'BarOrPub',
      '@id': `${url}#venue`,
      name: stegaClean(page.title),
      url,
      description,
      image,
      telephone: intlPhone(settings?.phone),
      email: settings?.email,
      address: postalAddress(settings),
      geo: GEO,
      hasMenu: menus ? (menuFile ?? url) : undefined,
      containedInPlace: parent,
      parentOrganization: parent,
    }
  }

  if (kind === 'EventVenue') {
    return {
      '@context': 'https://schema.org',
      '@type': 'EventVenue',
      '@id': `${url}#venue`,
      name: business,
      url,
      description,
      image,
      telephone: intlPhone(settings?.phone),
      address: postalAddress(settings),
      geo: GEO,
      containedInPlace: parent,
    }
  }

  return null
}

/** "7pm", "7.30pm", "19:30" → "19:30", or undefined if no clock time is in there. */
function firstClockTime(text?: string) {
  if (!text) return undefined
  const m = /(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?/i.exec(text)
  if (!m) return undefined
  let h = Number(m[1])
  const min = m[2] ?? '00'
  const ampm = m[3]?.toLowerCase()
  if (!ampm && !m[2]) return undefined // a bare number, e.g. "Round 2", isn't a time
  if (ampm === 'pm' && h < 12) h += 12
  if (ampm === 'am' && h === 12) h = 0
  if (h > 23) return undefined
  return `${String(h).padStart(2, '0')}:${min}`
}

/** UK clock offset on a date: "+00:00" in winter, "+01:00" in summer. */
function londonOffset(date: string) {
  const name = new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/London', timeZoneName: 'longOffset'})
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((p) => p.type === 'timeZoneName')?.value
  const m = /GMT([+-]\d{2}:\d{2})/.exec(name ?? '')
  return m ? m[1] : '+00:00'
}

/**
 * Event structured data for the upcoming events in a What's On section, so
 * gigs and quiz nights can appear as events in Google. Dates come from Studio
 * as calendar days; the start time is read from the free-text time field
 * ("7pm – 10pm") when it has one, and left off when it doesn't.
 */
export function eventsJsonLd(events: EventDoc[], settings?: SiteSettings) {
  if (!events.length) return null
  settings = stegaClean(settings) as SiteSettings | undefined
  const venue = {
    '@type': 'Place',
    name: settings?.businessName ?? 'Tregonetha Lake',
    address: postalAddress(settings),
    geo: GEO,
  }

  return events
    .map((raw) => {
      const e = stegaClean(raw) as EventDoc
      if (!e.title || !e.startDate) return null
      const time = firstClockTime(e.time)
      const start = time ? `${e.startDate}T${time}:00${londonOffset(e.startDate)}` : e.startDate
      const tickets = e.button?.link?.kind === 'external' ? e.button.link.href : undefined
      return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: e.title,
        startDate: start,
        endDate: e.endDate && e.endDate !== e.startDate ? e.endDate : undefined,
        description: e.description || undefined,
        image: e.image?.asset ? [shareImageUrl(e.image, 1200, 630)] : undefined,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: venue,
        organizer: {'@type': 'Organization', name: venue.name},
        offers: tickets ? {'@type': 'Offer', url: tickets} : undefined,
      }
    })
    .filter(Boolean)
}

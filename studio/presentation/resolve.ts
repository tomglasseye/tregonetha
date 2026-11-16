import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

/**
 * Tells Presentation where each document appears on the site, so an editor can
 * jump from a document straight to the page it renders on — and so the
 * "used on" list in the Structure tool is populated.
 */
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current', isHomepage: 'isHomepage'},
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled page',
            href: doc?.isHomepage ? '/' : `/${doc?.slug}`,
          },
        ],
      }),
    }),

    // Testimonials have no page of their own — they surface wherever a
    // testimonials section pulls them in.
    testimonial: defineLocations({
      select: {author: 'author'},
      resolve: (doc) => ({
        locations: [
          {title: 'Homepage', href: '/'},
        ],
        message: doc?.author
          ? `Shown wherever a testimonials section includes ${doc.author}.`
          : undefined,
      }),
    }),

    event: defineLocations({
      select: {title: 'title'},
      resolve: () => ({
        locations: [{title: 'Wildfire Lakeside Bar & Kitchen', href: '/wildfire'}],
        message: "Shown in any What's on section until the day after it ends.",
      }),
    }),

    // Settings and navigation are global.
    siteSettings: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{title: 'Homepage', href: '/'}],
        message: 'Phone, email and address appear in the header, footer and every contact band.',
      }),
    }),

    navigation: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{title: 'Homepage', href: '/'}],
        message: 'The header and footer menus on every page.',
      }),
    }),
  },
}

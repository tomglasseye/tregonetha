import {redirect} from 'react-router'
import type {Route} from './+types/page'
import {isPreviewEnabled, loadContent} from '~/sanity/preview.server'
import {useQuery} from '~/sanity/loader'
import {SLUG_QUERY, SITE_QUERY} from '~/sanity/queries'
import {SectionRenderer} from '~/components/SectionRenderer'
import {SiteLayout} from '~/components/SiteLayout'
import {buildMeta} from '~/seo'
import {seoContext} from '~/siteUrl.server'
import {findRedirect} from '~/lib/redirects.server'
import type {PageDoc, SiteData} from '~/types'

export async function loader({request, params}: Route.LoaderArgs) {
  const preview = await isPreviewEnabled(request)
  const queryParams = {slug: params.slug}

  const [page, site] = await Promise.all([
    loadContent<PageDoc | null>(SLUG_QUERY, queryParams, preview),
    loadContent<SiteData>(SITE_QUERY, {}, preview),
  ])

  if (!page.data) {
    // Not a page — maybe an old address an editor has pointed somewhere new.
    const moved = preview ? null : await findRedirect(request)
    if (moved) throw moved
    throw new Response('Not found', {status: 404})
  }

  // The homepage still has a slug, because it is an ordinary Page document. It
  // must not also answer on it: two URLs serving identical content splits the
  // ranking signals between them.
  if (page.data.isHomepage) {
    throw redirect('/', 301)
  }

  return {
    initial: page,
    site: site.data,
    query: SLUG_QUERY,
    params: queryParams,
    preview,
    ...seoContext(request),
  }
}

export function meta({loaderData}: Route.MetaArgs) {
  return buildMeta(loaderData?.initial?.data, loaderData?.site?.settings, {
    canonicalUrl: loaderData?.canonicalUrl,
    indexable: loaderData?.indexable,
  })
}

export default function Page({loaderData}: Route.ComponentProps) {
  const {initial, site, query, params, preview, siteUrl} = loaderData

  const {data} = useQuery<PageDoc | null>(query, params, {initial})
  const page = (preview ? (data ?? initial.data) : initial.data) as PageDoc


  return (
    <SiteLayout site={site} siteUrl={siteUrl} page={page}>
      <SectionRenderer sections={page.sections} settings={site?.settings} />
    </SiteLayout>
  )
}

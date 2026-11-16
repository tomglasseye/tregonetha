import type {SiteSettings} from '~/types'

/**
 * The logo to show. One uploaded in Site settings wins and is resized by the
 * Sanity CDN; until then the white Tregonetha Lake mark in /public is used, so
 * the header and homepage hero are never missing it.
 */
export function logoSrc(settings: SiteSettings | undefined, width: number): string {
  const url = settings?.logoUrl
  if (!url) return '/logo-mark.svg'
  // SVGs are served as-is by the CDN; only raster images take size params.
  return url.endsWith('.svg') ? url : `${url}?w=${width}&fit=max&auto=format`
}

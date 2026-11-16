import type {SiteSettings} from '~/types'

/**
 * The logo to show. One uploaded in Site settings wins and is resized by the
 * Sanity CDN; until then the white Tregonetha Lake mark in /public is used, so
 * the header and homepage hero are never missing it.
 */
export function logoSrc(
  settings: SiteSettings | undefined,
  width: number,
  variant: 'light' | 'dark' = 'light',
): string {
  const url = settings?.logoUrl
  // 'dark' is for pale grounds (the sage header); 'light' for dark photos.
  if (!url) return variant === 'dark' ? '/logo-mark-dark.svg' : '/logo-mark.svg'
  // SVGs are served as-is by the CDN; only raster images take size params.
  return url.endsWith('.svg') ? url : `${url}?w=${width}&fit=max&auto=format`
}

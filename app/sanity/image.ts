import {createImageUrlBuilder} from '@sanity/image-url'
import {client} from './client'
import type {SanityImage} from '~/types'

const builder = createImageUrlBuilder(client)

// Derived from the builder rather than imported: the type's module path has
// moved between @sanity/image-url majors, this never breaks.
type ImageSource = Parameters<typeof builder.image>[0]

/** Quality 78 is the point where the next step down starts to show on foliage. */
const QUALITY = 78

/**
 * Candidate widths. Steps of roughly 1.25x through the range phones actually
 * request (a 360–430px screen at 2–3x lands anywhere from 640 to 1300), so the
 * nearest candidate is never much bigger than the slot. Wider gaps above that:
 * few screens need them and every step is another entry in Sanity's CDN cache.
 */
const WIDTHS = [320, 480, 640, 800, 960, 1200, 1440, 1920, 2400]

export function urlFor(source: ImageSource) {
  return builder.image(source).auto('format').quality(QUALITY)
}

type BuildOptions = {
  /** Force a crop to this ratio (width / height). Omit to keep the original. */
  aspect?: number
  /** Never request wider than the source; pass its natural width to cap. */
  maxWidth?: number
}

/**
 * Sanity's builder honours the hotspot and crop set in Studio, but only when
 * `fit: 'crop'` is combined with an explicit height — otherwise the editor's
 * chosen focal point is silently ignored and the middle of the photo wins.
 */
function sized(source: ImageSource, width: number, {aspect}: BuildOptions) {
  const url = urlFor(source).width(width)
  return aspect
    ? url.height(Math.round(width / aspect)).fit('crop').crop('focalpoint').url()
    : url.fit('max').url()
}

export function imageProps(image: SanityImage | undefined, options: BuildOptions = {}) {
  if (!image?.asset) return null

  const source = image as unknown as ImageSource
  const natural = image.dimensions?.width ?? Math.max(...WIDTHS)
  const cap = Math.min(options.maxWidth ?? natural, natural)

  // Always keep at least one candidate, even for a small source image.
  const widths = WIDTHS.filter((w) => w <= cap)
  // Offer the source's own width as the top candidate (a 2048px upload should
  // be reachable on a large retina screen, not stop at 1920).
  if (widths.length === 0 || cap > widths[widths.length - 1]) widths.push(cap)

  const largest = widths[widths.length - 1]

  return {
    src: sized(source, largest, options),
    srcSet: widths.map((w) => `${sized(source, w, options)} ${w}w`).join(', '),
    width: largest,
    height: options.aspect
      ? Math.round(largest / options.aspect)
      : image.dimensions
        ? Math.round(largest / image.dimensions.aspectRatio)
        : undefined,
    lqip: image.lqip,
  }
}

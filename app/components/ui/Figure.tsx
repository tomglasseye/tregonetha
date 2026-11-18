import {useState} from 'react'
import {preload} from 'react-dom'
import type {SanityImage} from '~/types'
import {imageProps} from '~/sanity/image'
import {sizes as sizesFor, type SizesLayout} from '~/lib/imageSizes'

type Props = {
  image?: SanityImage
  className?: string
  imgClassName?: string
  /**
   * How wide this image is drawn, so the browser downloads the right file from
   * srcset. Prefer the layout form, which accounts for the page gutter, grid gap
   * and container max width: `{cols: {base: 1, lg: 2}, gap: 64}`, or
   * `{bleed: true}` for edge-to-edge. A raw `sizes` string still works.
   * Getting this right is most of the win — a card drawn 400px wide should
   * never download the 1920px file just because the viewport is wide.
   */
  sizes?: string | SizesLayout
  /** Crop to a fixed ratio (width / height), honouring the Studio hotspot. */
  aspect?: number
  /** Above the fold: skip lazy-loading and fetch it early. */
  priority?: boolean
  rounded?: boolean
}

/**
 * Every image on the site goes through here.
 *
 * Alt text is enforced by the schema, so it is trusted. A decorative image gets
 * alt="" and is hidden from assistive tech.
 */
export function Figure({
  image,
  className = '',
  imgClassName = '',
  sizes: sizesProp = {bleed: true},
  aspect,
  priority = false,
  rounded = true,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const props = imageProps(image, {aspect})
  const sizes = typeof sizesProp === 'string' ? sizesProp : sizesFor(sizesProp)

  if (!props) return null

  // The above-the-fold image (usually the hero, and so the LCP element) is
  // announced in <head> with the same srcset and sizes, so the browser starts
  // the right file alongside the stylesheet instead of after parsing the body.
  // React 19 hoists this and dedupes it across renders.
  if (priority) {
    preload(props.src, {
      as: 'image',
      imageSrcSet: props.srcSet,
      imageSizes: sizes,
      fetchPriority: 'high',
    })
  }

  return (
    <figure className={`relative overflow-hidden ${rounded ? 'rounded-panel' : ''} ${className}`}>
      {/* The LQIP sits behind the image rather than on it, so it can fade out
          cleanly instead of showing through a partially-decoded JPEG. */}
      {props.lqip ? (
        <span
          aria-hidden
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{backgroundImage: `url(${props.lqip})`}}
        />
      ) : null}

      <img
        src={props.src}
        srcSet={props.srcSet}
        sizes={sizes}
        alt={image?.decorative ? '' : (image?.alt ?? '')}
        aria-hidden={image?.decorative || undefined}
        width={props.width}
        height={props.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setLoaded(true)}
        // Server-rendered images are often already complete before React
        // hydrates, so onLoad never fires — check on mount too.
        ref={(node) => {
          if (node?.complete) setLoaded(true)
        }}
        data-loaded={loaded ? 'true' : undefined}
        className={`relative h-full w-full object-cover ${
          priority ? '' : 'u-img-fade'
        } ${imgClassName}`}
      />

      {image?.caption ? (
        <figcaption className="mt-3 text-sm text-muted">{image.caption}</figcaption>
      ) : null}
    </figure>
  )
}

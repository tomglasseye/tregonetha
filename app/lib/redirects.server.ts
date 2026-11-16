import {redirect} from 'react-router'
import {publicClient} from '~/sanity/loader.server'
import {REDIRECT_QUERY} from '~/sanity/queries'

type Hit = {to: string; permanent?: boolean | null} | null

const MAX_HOPS = 5

const normalise = (path: string) => {
  const p = path.trim().toLowerCase().replace(/\/+$/, '')
  return p === '' ? '/' : p
}

async function lookup(path: string): Promise<Hit> {
  const p = normalise(path)
  try {
    return await publicClient.fetch<Hit>(REDIRECT_QUERY, {path: p, pathSlash: `${p}/`})
  } catch {
    // A Sanity hiccup must not turn a working page into an error.
    return null
  }
}

/**
 * If an editor has set up a redirect for this address, returns the Response to
 * throw. Chains (A→B→C) are followed here so visitors and Google see one hop,
 * and a loop gives up rather than bouncing forever.
 */
export async function findRedirect(request: Request): Promise<Response | null> {
  const url = new URL(request.url)
  let hit = await lookup(url.pathname)
  if (!hit) return null

  let permanent = hit.permanent !== false
  let to = hit.to
  const seen = new Set([normalise(url.pathname)])

  for (let hops = 0; hops < MAX_HOPS && to.startsWith('/'); hops++) {
    const key = normalise(to.split(/[?#]/)[0])
    if (seen.has(key)) return null // loop
    seen.add(key)
    const next = await lookup(key)
    if (!next) break
    permanent = permanent && next.permanent !== false
    to = next.to
  }

  // Keep tracking parameters (utm_*, gclid) on internal moves.
  if (to.startsWith('/') && !to.includes('?')) to += url.search

  return redirect(to, permanent ? 301 : 302)
}

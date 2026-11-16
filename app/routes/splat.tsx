import type {Route} from './+types/splat'
import {findRedirect} from '~/lib/redirects.server'

/**
 * Catches addresses with more than one segment (/blog/old-post). Pages live at
 * one level, so the only way to get here successfully is an editor-defined
 * redirect; everything else is a genuine 404.
 */
export async function loader({request}: Route.LoaderArgs) {
  const moved = await findRedirect(request)
  if (moved) throw moved
  throw new Response('Not found', {status: 404})
}

export default function Splat() {
  return null
}

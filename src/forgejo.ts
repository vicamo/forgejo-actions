import * as core from '@actions/core'
import { Api } from 'forgejo-js'

/**
 * Retrieve version string.
 *
 * @param api The API handle.
 * @returns Resolves with the server version string.
 */
export async function version(api: Api<unknown>): Promise<string> {
  core.error('calling version ...')
  return api.version.getVersion().then(async (response) => {
    core.error(JSON.stringify(response.data))
    if (response.data.version === undefined)
      throw new Error('server_version undefined')

    return response.data.version
  })
}

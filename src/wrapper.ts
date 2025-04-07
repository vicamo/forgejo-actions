import * as core from '@actions/core'
import { forgejoApi, Api } from 'forgejo-js'

/**
 * Helper function to create forgejoApi from github inputs.
 *
 * @returns an Api instance instantiated from input server url and the authenticate token.
 */
export function createApi() {
  const server_url: string = core.getInput('server_url')
  const token: string = core.getInput('token')

  core.debug(`Using server instance at ${server_url} ...`)

  const options = token !== '' ? { token: token } : undefined
  const api = forgejoApi(server_url, options)

  return api
}

/**
 * Retrieve version string.
 *
 * @param api The API handle.
 * @returns Resolves with the server version string.
 */
export async function version(api: Api<unknown>): Promise<string> {
  const response = await api.version.getVersion()
  if (typeof response.data.version === 'undefined')
    throw new Error('Server version undefined.')

  return response.data.version
}

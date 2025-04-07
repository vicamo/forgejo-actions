import { Api } from 'forgejo-js'

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

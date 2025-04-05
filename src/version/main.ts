import * as core from '@actions/core'
import { forgejoApi } from 'forgejo-js'
import * as forgejo from '../forgejo.js'

/**
 * The main function for the action.
 */
export async function run() {
  try {
    const server_url: string = core.getInput('server_url')
    const token: string = core.getInput('token')

    core.debug(`Using server instance at ${server_url} ...`)

    const api = forgejoApi(server_url, { token: token })
    const v = await forgejo.version(api)

    core.setOutput('version', v)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

import * as core from '@actions/core'

/**
 * The main function for the action.
 */
export function run() {
  try {
    const server_url: string = core.getInput('server_url')

    core.debug(`Using server instance at ${server_url} ...`)

    core.setOutput('version', '0.0')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

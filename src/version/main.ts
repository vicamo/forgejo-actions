import * as core from '@actions/core'
import * as wrapper from '../wrapper.js'

/**
 * The main function for the action.
 */
export async function run() {
  try {
    const api = wrapper.createApi()

    const version = await wrapper.version(api)

    core.setOutput('version', version)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

/**
 * Unit tests for the action's main functionality, src/version/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { forgejoApi } from 'forgejo-js'
import { jest } from '@jest/globals'
import * as core from '../../__fixtures__/core.js'
import * as wrapper from '../../__fixtures__/wrapper.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../../src/wrapper.js', () => wrapper)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../../src/version/main.js')

const DEFAULT_SERVER_URL = 'https://codeberg.org'

const OUTPUT_VERSION = 'version'

describe('version/main.ts', () => {
  beforeEach(() => {
    wrapper.createApi.mockImplementation(() => {
      return forgejoApi(DEFAULT_SERVER_URL)
    })
    wrapper.version.mockImplementation(() => Promise.resolve('0.0'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('run(): simple call', async () => {
    await run()

    // Verify wrapper.createApi called
    expect(wrapper.createApi).toHaveBeenCalledTimes(1)
    // Verify wrapper.version called
    expect(wrapper.version).toHaveBeenCalledTimes(1)
    // Verify the version output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      OUTPUT_VERSION,
      expect.stringMatching(/^\d+\.\d+/)
    )
  })

  it('run(): sets a failed status', async () => {
    const expectedMessage = 'Input required and not supplied: server_url'

    // Clear the getInput mock and return an invalid value.
    wrapper.createApi.mockClear().mockImplementationOnce(() => {
      throw new Error(expectedMessage)
    })

    await run()

    // Verify wrapper.createApi called
    expect(wrapper.createApi).toHaveBeenCalledTimes(1)
    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(1, expectedMessage)
  })
})

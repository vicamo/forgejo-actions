/**
 * Unit tests for the action's main functionality, src/version/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../../__fixtures__/core.js'
import * as wrapper from '../../__fixtures__/wrapper.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../../src/wrapper.js', () => wrapper)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../../src/version/main.js')

const INPUT_SERVER_URL = 'server_url'
const INPUT_TOKEN = 'token'

const DEFAULT_SERVER_URL = 'https://codeberg.org'
const DEFAULT_TOKEN_UNDEFINED = ''
const DEFAULT_TOKEN_RANDOM = '42ebd224-fad1-4e07-8fc0-261dc0abf057' // gitleaks:allow
let DEFAULT_TOKEN = DEFAULT_TOKEN_UNDEFINED

const OUTPUT_VERSION = 'version'

describe('version/main.ts', () => {
  beforeEach(() => {
    DEFAULT_TOKEN = DEFAULT_TOKEN_UNDEFINED

    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case INPUT_SERVER_URL:
          return DEFAULT_SERVER_URL
        case INPUT_TOKEN:
          return DEFAULT_TOKEN
        default:
          throw new Error(`Input required and not supplied: ${name}`)
      }
    })

    wrapper.version.mockImplementation(() => Promise.resolve('0.0'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Simple call', async () => {
    await run()

    // Verify the inputs were retrieved.
    expect(core.getInput).toHaveBeenNthCalledWith(1, INPUT_SERVER_URL)
    expect(core.getInput).toHaveBeenNthCalledWith(2, INPUT_TOKEN)
    // Verify wrapper.version called
    expect(wrapper.version).toHaveBeenCalledTimes(1)
    // Verify the version output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      OUTPUT_VERSION,
      expect.stringMatching(/^\d+\.\d+/)
    )
  })

  it('Simple call with token', async () => {
    DEFAULT_TOKEN = DEFAULT_TOKEN_RANDOM

    await run()

    // Verify the inputs were retrieved.
    expect(core.getInput).toHaveBeenNthCalledWith(1, INPUT_SERVER_URL)
    expect(core.getInput).toHaveBeenNthCalledWith(2, INPUT_TOKEN)
    // Verify wrapper.version called
    expect(wrapper.version).toHaveBeenCalledTimes(1)
    // Verify the version output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      OUTPUT_VERSION,
      expect.stringMatching(/^\d+\.\d+/)
    )
  })

  it('Sets a failed status', async () => {
    const expectedMessage = 'Input required and not supplied: server_url'

    // Clear the getInput mock and return an invalid value.
    core.getInput.mockClear().mockImplementationOnce(() => {
      throw new Error(expectedMessage)
    })

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(1, expectedMessage)
  })
})

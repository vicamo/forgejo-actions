/**
 * Unit tests for the action's main functionality, src/version/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../../__fixtures__/core.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../../src/version/main.js')

const INPUT_SERVER_URL = 'server_url'

const DEFAULT_SERVER_URL = 'https://codeberg.org'

const OUTPUT_VERSION = 'version'

describe('version/main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case INPUT_SERVER_URL:
          return DEFAULT_SERVER_URL
        default:
          throw new Error(`Input required and not supplied: ${name}`)
      }
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Simple call', async () => {
    run()

    // Verify the inputs were retrieved.
    expect(core.getInput).toHaveBeenNthCalledWith(1, INPUT_SERVER_URL)

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

    run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(1, expectedMessage)
  })
})

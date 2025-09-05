/**
 * Unit tests for src/wrapper.ts
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const wrapper = await import('../src/wrapper.js')

const INPUT_SERVER_URL = 'server_url'
const INPUT_TOKEN = 'token'

const DEFAULT_SERVER_URL = 'https://codeberg.org'
const DEFAULT_TOKEN_UNDEFINED = ''
const DEFAULT_TOKEN_RANDOM = '42ebd224-fad1-4e07-8fc0-261dc0abf057' // gitleaks:allow
let DEFAULT_TOKEN = DEFAULT_TOKEN_UNDEFINED

describe('wrapper.ts', () => {
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
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  /**
   * Tests for createApi()
   */

  it('createApi(): simple call', async () => {
    const api = wrapper.createApi()

    // Verify api instance
    expect(api.baseUrl).toMatch(DEFAULT_SERVER_URL)
    // Verify the inputs were retrieved.
    expect(core.getInput).toHaveBeenNthCalledWith(1, INPUT_SERVER_URL)
    expect(core.getInput).toHaveBeenNthCalledWith(2, INPUT_TOKEN)
  })

  it('createApi(): simple call with token', async () => {
    DEFAULT_TOKEN = DEFAULT_TOKEN_RANDOM

    const api = wrapper.createApi()

    // Verify api instance
    expect(api.baseUrl).toMatch(DEFAULT_SERVER_URL)
    // Verify the inputs were retrieved.
    expect(core.getInput).toHaveBeenNthCalledWith(1, INPUT_SERVER_URL)
    expect(core.getInput).toHaveBeenNthCalledWith(2, INPUT_TOKEN)
  })

  /**
   * Tests for version()
   */

  it('version(): simple call', async () => {
    const api = wrapper.createApi()

    type GetVersionType = typeof api.version.getVersion
    type ResponseType = Awaited<ReturnType<GetVersionType>>
    const EXPECTED_VERSION = '9.0'

    let mock: jest.Spied<GetVersionType> | undefined = undefined
    mock = jest
      .spyOn(api.version, 'getVersion')
      .mockImplementation(async () => {
        const response = { data: {} } as ResponseType
        response.data.version = EXPECTED_VERSION
        return response
      })

    await expect(wrapper.version(api)).resolves.toBe(EXPECTED_VERSION)
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it('version(): undefined version string', async () => {
    const api = wrapper.createApi()

    type GetVersionType = typeof api.version.getVersion
    type ResponseType = Awaited<ReturnType<GetVersionType>>

    let mock: jest.Spied<GetVersionType> | undefined = undefined
    mock = jest
      .spyOn(api.version, 'getVersion')
      .mockImplementation(async () => {
        const response = { data: {} } as ResponseType
        return response
      })

    await expect(wrapper.version(api)).rejects.toThrow(
      'Server version undefined.'
    )
    expect(mock).toHaveBeenCalledTimes(1)
  })
})

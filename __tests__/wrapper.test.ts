/**
 * Unit tests for src/wrapper.ts
 */
import { forgejoApi } from 'forgejo-js'
import { jest } from '@jest/globals'

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const wrapper = await import('../src/wrapper.js')

const DEFAULT_SERVER_URL = 'https://codeberg.org'

describe('wrapper.ts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  /**
   * Tests for version()
   */

  it('Valid version string', async () => {
    const api = forgejoApi(DEFAULT_SERVER_URL)

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

  it('Undefined version string', async () => {
    const api = forgejoApi(DEFAULT_SERVER_URL)

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

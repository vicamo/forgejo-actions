import type * as forgejo from 'forgejo-js'
import { jest } from '@jest/globals'

export const forgejoApi = jest.fn<typeof forgejo.forgejoApi>()
export const Api = forgejo.Api

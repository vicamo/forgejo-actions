import type * as wrapper from '../src/wrapper.js'
import { jest } from '@jest/globals'

export const createApi = jest.fn<typeof wrapper.createApi>()
export const version = jest.fn<typeof wrapper.version>()

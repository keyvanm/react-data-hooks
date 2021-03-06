import { renderHook, cleanup, act, unmount } from '@testing-library/react-hooks'
import { createRestHook, clearStore } from '../src'

describe('react-data-hooks', () => {
  describe('EXPORTS', () => {
    it(`import { createRestHook } from 'react-data-hooks'`, () => {
      expect(typeof createRestHook).toBe('function')
    })

    it(`import { clearStore } from 'react-data-hooks'`, () => {
      expect(typeof clearStore).toBe('function')
    })
  })

  describe('createRestHook(endpoint, options) return interface', () => {
    const useData = createRestHook('/api/somewhere')

    const { result } = renderHook(() => useData({ autoload: false }))

    const attributes = [
      { name: 'data', type: 'object', defaults: [] },
      { name: 'filtered', type: 'object', defaults: [] },
      { name: 'key', type: 'object' },
      { name: 'isLoading', type: 'boolean' },
      { name: 'error', type: 'undefined', defaults: undefined },
      { name: 'load', type: 'function' },
      { name: 'refresh', type: 'function' },
      { name: 'create', type: 'function' },
      { name: 'remove', type: 'function' },
      { name: 'replace', type: 'function' },
      { name: 'update', type: 'function' },
    ]

    let hook = result.current

    for (let attribute of attributes) {
      let { type, name, defaults } = attribute
      let hasDefaults = attribute.hasOwnProperty('defaults')

      test(`returns ${name} property (${type}) ${hasDefaults ? 'with default value = ' + defaults : ''}`, () => {
        expect(hook.hasOwnProperty(name)).toBe(true)
        expect(typeof hook[name]).toBe(type)
        if (defaults) {
          expect(hook[name]).toEqual(defaults)
        }
      })
    }
  })
})

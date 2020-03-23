'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var react = require('react')
var react__default = _interopDefault(react)

function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x
}

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports
}

var interopRequireDefault = createCommonjsModule(function(module) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj,
        }
  }

  module.exports = _interopRequireDefault
})

unwrapExports(interopRequireDefault)

var _typeof_1 = createCommonjsModule(function(module) {
  function _typeof2(obj) {
    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      _typeof2 = function _typeof2(obj) {
        return typeof obj
      }
    } else {
      _typeof2 = function _typeof2(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }
    }
    return _typeof2(obj)
  }

  function _typeof(obj) {
    if (typeof Symbol === 'function' && _typeof2(Symbol.iterator) === 'symbol') {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj)
      }
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
          ? 'symbol'
          : _typeof2(obj)
      }
    }

    return _typeof(obj)
  }

  module.exports = _typeof
})

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr
}

var arrayWithHoles = _arrayWithHoles

function _iterableToArrayLimit(arr, i) {
  var _arr = []
  var _n = true
  var _d = false
  var _e = undefined

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value)

      if (i && _arr.length === i) break
    }
  } catch (err) {
    _d = true
    _e = err
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']()
    } finally {
      if (_d) throw _e
    }
  }

  return _arr
}

var iterableToArrayLimit = _iterableToArrayLimit

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance')
}

var nonIterableRest = _nonIterableRest

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest()
}

var slicedToArray = _slicedToArray

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var classCallCheck = _classCallCheck

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }

  return obj
}

var defineProperty = _defineProperty

var useStore_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, '__esModule', {
    value: true,
  })
  exports.useStore = useStore
  exports['default'] = exports.globalStore = exports.GlobalStore = exports.Store = void 0

  var _typeof2 = interopRequireDefault(_typeof_1)

  var _slicedToArray2 = interopRequireDefault(slicedToArray)

  var _classCallCheck2 = interopRequireDefault(classCallCheck)

  var _defineProperty2 = interopRequireDefault(defineProperty)

  var GLOBALSTORAGE_PREFIX = '!ush::'

  var debounce = function debounce(func) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100
    var timer
    return function() {
      var context = this
      var args = arguments
      clearTimeout(timer)
      timer = setTimeout(function() {
        return func.apply(context, args)
      }, delay)
    }
  } // https://stackoverflow.com/a/2117523/11599918

  var uuid = function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  } // individual Store implementation for tracking values/setters

  var Store = function Store(_ref) {
    var _this = this

    var _value = _ref.value,
      namespace = _ref.namespace,
      _options = _ref.options
    ;(0, _classCallCheck2['default'])(this, Store)
    ;(0, _defineProperty2['default'])(
      this,
      'handleMessage',
      debounce(function(e) {
        if (!e.data || e.data.id === _this.id) {
          return
        }

        _this.setState(e.data.message, {
          broadcast: false,
        })
      }, 300)
    )
    ;(0, _defineProperty2['default'])(this, 'setState', function(value) {
      var options =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : {
              broadcast: true,
            }
      _this.state = value

      if (_this.options.persist) {
        try {
          localStorage.setItem(GLOBALSTORAGE_PREFIX + _this.namespace, JSON.stringify(value))
        } catch (err) {
          console.warn('[use-store-hook]: failed to persist', {
            value: value,
            err: err,
          })
        }
      }

      _this.setters.forEach(function(setter) {
        return setter(_this.state)
      })

      if (options.broadcast && _this.options.broadcast) {
        _this.channel.postMessage({
          id: _this.id,
          message: value,
        })
      }
    })
    this.state = _value
    this.id = uuid()

    if (_options.persist) {
      try {
        var stored = localStorage.getItem(GLOBALSTORAGE_PREFIX + namespace)

        if (stored !== null) {
          this.state = JSON.parse(stored)
        }
      } catch (err) {}
    }

    if (_options.broadcast && window.BroadcastChannel) {
      this.channel = new BroadcastChannel(GLOBALSTORAGE_PREFIX + namespace)
      this.channel.addEventListener('message', this.handleMessage)
    }

    this.options = _options
    this.namespace = namespace
    this.setters = []
  } // namespaced index of requested Stores

  exports.Store = Store

  var GlobalStore = function GlobalStore() {
    var _this2 = this

    ;(0, _classCallCheck2['default'])(this, GlobalStore)
    ;(0, _defineProperty2['default'])(this, 'set', function(namespace, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}

      if (_this2.hasOwnProperty(namespace)) {
        _this2[namespace].setState(value)
      } else {
        _this2[namespace] = new Store({
          value: value,
          options: options,
          namespace: namespace,
        })
      }
    })
    ;(0, _defineProperty2['default'])(this, 'clear', function(namespace) {
      localStorage.removeItem(GLOBALSTORAGE_PREFIX + namespace)
    })
    ;(0, _defineProperty2['default'])(this, 'persist', function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key]
      }

      return _this2.set.apply(
        _this2,
        args.concat([
          {
            persist: true,
          },
        ])
      )
    })
  } // shared instantiation of GlobalStore

  exports.GlobalStore = GlobalStore
  var globalStore = new GlobalStore() // the actual hook

  exports.globalStore = globalStore

  function useStore(namespace, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
    var whichStore = undefined

    if (!namespace) {
      throw new Error('no namespace provided to useStore... try using useState() instead?')
    }

    if (globalStore.hasOwnProperty(namespace)) {
      whichStore = globalStore[namespace]
    } else {
      whichStore = globalStore[namespace] = new Store({
        value: value,
        options: options,
        namespace: namespace,
      })
    }

    var _useState = (0, react__default.useState)(whichStore.state),
      _useState2 = (0, _slicedToArray2['default'])(_useState, 2),
      state = _useState2[0],
      set = _useState2[1]

    if (whichStore.setters.indexOf(set) === -1) {
      whichStore.setters.push(set)
    }

    ;(0, react__default.useEffect)(function() {
      return function() {
        whichStore.setters = whichStore.setters.filter(function(setter) {
          return setter !== set
        })
      }
    }, [])

    var magicSetter = function magicSetter(setter) {
      return function(e) {
        ;(0, _typeof2['default'])(e) === 'object' &&
        (e.nativeEvent || e.constructor.name === 'SyntheticEvent') &&
        e.target
          ? setter(e.target.value)
          : setter(e)
      }
    }

    return [state, magicSetter(whichStore.setState)]
  }

  var _default = useStore
  exports['default'] = _default
})

var useStore = unwrapExports(useStore_1)
var useStore_2 = useStore_1.useStore
var useStore_3 = useStore_1.globalStore
var useStore_4 = useStore_1.GlobalStore
var useStore_5 = useStore_1.Store

const isJSON = response => (response.headers.get('content-type') || '').indexOf('json') !== -1

const getBody = response => {
  if (!response) {
    return undefined
  }

  if (isJSON(response)) {
    return response.json ? response.json() : JSON.parse(response)
  }

  return response.body
}

const emulateAxiosResponse = data => ({
  data,
})

const catchErrors = async response => {
  if (response.status >= 400) {
    const errorResponse = new Error(response.statusText)
    errorResponse.status = Number(response.status)
    errorResponse.msg = response.statusText
    errorResponse.body = await getBody(response)
    throw errorResponse
  }

  return response
}

const createFetchCall = (method = 'GET') => (url, data, fetchOptions = {}) => {
  let payload = {} // if (Object.keys(fetchOptions).length) {
  //   console.log('creating', method, 'call with fetchOptions', fetchOptions)
  // }

  let { headers = {}, ...otherFetchOptions } = fetchOptions
  fetchOptions = otherFetchOptions
  fetchOptions.headers = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (typeof data === 'object') {
    // parse query params
    if (method === 'GET') {
      let { params = {} } = data || {}
      let query = Object.keys(params)
        .map(param => `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
        .join('&')

      if (query.length) {
        url += '?' + query
      }
    } else {
      // parse payloads for POST|PUT|PATCH
      payload = {
        body: JSON.stringify(data),
      }
    }
  }

  return fetch(url, {
    method,
    ...payload,
    ...fetchOptions,
  })
    .then(catchErrors)
    .then(getBody)
    .then(emulateAxiosResponse)
}

const fetchAxios = {
  get: createFetchCall('GET'),
  post: createFetchCall('POST'),
  put: createFetchCall('PUT'),
  patch: createFetchCall('PATCH'),
  delete: createFetchCall('DELETE'),
}

class FetchStore {
  constructor() {
    this.fetches = {}
    this.fetcher = fetchAxios
    this.debounce = 100
  }

  setAxios(axios) {
    this.fetcher = axios
    return this
  }

  setDebounce(value) {
    this.debounce = value
  }

  setExpiration(key) {
    let fetchEntry = this.fetches[key] || {}
    let { expires } = fetchEntry

    if (expires) {
      clearTimeout(expires)
    }

    fetchEntry.expires = setTimeout(() => this.expireFetch(key), this.debounce)
  }

  get(...args) {
    let key = JSON.stringify(args)
    let fetchEntry = this.fetches[key]

    if (fetchEntry) {
      this.setExpiration(key)
    }

    if (!fetchEntry) {
      fetchEntry = this.fetches[key] = {
        fetch: this.fetcher.get(...args),
      }
      this.setExpiration(key)
    }

    return fetchEntry.fetch
  }

  expireFetch(key) {
    delete this.fetches[key]
  }
}

const getPatch = (newItem, oldItem) =>
  oldItem
    ? Object.keys(newItem).reduce((final, key) => {
        let newValue = newItem[key]
        let oldValue = oldItem[key]

        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          final[key] = newValue
        }

        return final
      }, {})
    : newItem
const objectFilter = (filter = {}) => (obj = {}) =>
  Object.keys(filter).reduce((out, key) => out && filter[key] === obj[key], true) // helper function to return an instantly resolved or rejected promise

const resolveReject = resolution => (
  msg,
  options = {
    timeout: undefined,
    fn: undefined,
  }
) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      options.fn && options.fn()
      resolution === 'resolve' ? resolve(msg) : reject(msg)
    }, options.timeout)
  })
const autoResolve = resolveReject('resolve')
const autoReject = resolveReject('reject')

const LOG_PREFIX = '[react-data-hooks]: '
const HASH_PREFIX = 'rdh:' // helper function to assemble endpoint parts, joined by '/', but removes undefined attributes

const getEndpoint = (...parts) => parts.filter(p => p !== undefined).join('/') // generates a unique hash for component render-busting via <Component key={someUniqueKey} />

const getHash = () => ({
  key: Math.floor(Math.random() * 1e12),
}) // converts a value or function into the corresponding value

const functionOrValue = fnv => {
  const value = typeof fnv === 'function' ? fnv() : fnv

  if (typeof fnv !== 'undefined' && !['string', 'number'].includes(typeof value)) {
    console.log('throwing on', {
      fnv,
      value,
      type: typeof fnv,
    })
    throw new TypeError('"namespace" option must be a string, number, or function that returns one of those')
  }

  return value || ''
} // no-op for logging

const noop = () => {} // localStorage-clearing function

const clearStore = (namespace, undefinedAllowed = true) => {
  if (namespace === undefined && !undefinedAllowed) {
    throw new TypeError('"namespace" option must be set when using clearStore() to prevent over-aggressive clearing')
  }

  let pattern = HASH_PREFIX + (namespace ? namespace + ':' : '') // console.log('clearing store with pattern', pattern, 'from localStorage', Object.keys(localStorage))

  Object.keys(localStorage)
    .filter(key => key.indexOf(pattern) !== -1)
    .forEach(key => {
      // console.log('removing store entry', key)
      localStorage.removeItem(key)
    }) // .forEach(key => console.log('testing', key, ' => ', pattern.test(key)))
} // helper function to handle functions that may be passed a DOM event

const eventable = fn => (...args) => {
  let arg0 = args[0] || {}

  if (arg0.nativeEvent instanceof Event) {
    return fn()
  }

  return fn(...args)
} // instantiate shared fetch pool for GET requests

const fetchStore = new FetchStore()

const createLogAndSetMeta = ({ log, setMeta }) => newMeta => {
  log('setting meta', newMeta)
  setMeta(newMeta)
}

const createRestHook = (endpoint, createHookOptions = {}) => (...args) => {
  let [id, hookOptions] = args
  let isMountedRef = react.useRef(true)
  let isMounted = isMountedRef.current
  let idExplicitlyPassed = args.length && typeof args[0] !== 'object'

  if (typeof id === 'object' && hookOptions === undefined) {
    // e.g. useHook({ something })
    hookOptions = id // use first param as options

    id = undefined
  }

  hookOptions = hookOptions || {} // local options are a blend of factory options and instantiation options

  let options = { ...createHookOptions, ...hookOptions } // extract options

  let {
    appendSlash = false,
    autoload = true,
    axios = fetchAxios,
    fetchOptions = {},
    filter,
    getId = item => item.id,
    // handles the use-case of non-collections (will use id if present)
    initialValue,
    interval,
    isCollection,
    loadOnlyOnce = false,
    log = () => {},
    mergeOnCreate = true,
    mergeOnUpdate = true,
    mock,
    namespace,
    // string, number, or function that returns one
    onAuthenticationError,
    onCreate = () => {},
    onError = console.error,
    onLoad = () => {},
    onRemove = () => {},
    onReplace = () => {},
    onUpdate = () => {},
    query = {},
    transform,
    transformCollection,
    transformItem,
  } = options
  let isCollectionExplicitlySet = options.hasOwnProperty('isCollection')
  let isFixedEndpoint = isCollection === false
  var loadingInterval // allow { log: true } alias as well as routing to custom loggers

  log = log === true ? (...args) => console.log.apply(null, [LOG_PREFIX, ...args]) : log || noop

  if (axios !== fetchAxios) {
    log('using custom axios', axios)
    fetchStore.setAxios(axios)
  } // if isCollection not explicitly set, try to derive from arguments

  if (!isCollectionExplicitlySet) {
    // for collections, clear id, and derive options from first param
    if (idExplicitlyPassed) {
      // e.g. useHook('foo') useHook(3)
      isCollection = false
      isFixedEndpoint = true
    } else {
      isCollection = true
    }
  } else {
    // isCollection explicitly set
    if (isCollection === false && idExplicitlyPassed) {
      let errorObj = new Error(`${LOG_PREFIX} id should not be explicitly passed with option { isCollection: false }`)
      errorObj.isCollection = isCollection
      errorObj.idExplicitlyPassed = idExplicitlyPassed
      errorObj.args = args
      onError(errorObj)
      throw errorObj
    }
  } // initialValue defines the initial state of the data response ([] for collection queries, or undefined for item lookups)

  initialValue = options.hasOwnProperty('initialValue') ? initialValue : isCollection ? [] : undefined
  let queryKey =
    typeof query === 'object'
      ? Object.keys(query).length
        ? JSON.stringify(query)
        : undefined
      : typeof query === 'function'
      ? JSON.stringify({
          dynamic: true,
        })
      : undefined
  let key =
    HASH_PREFIX +
    functionOrValue(namespace) +
    ':' +
    getEndpoint(endpoint, (!isCollection && (id || ':id')) || undefined, queryKey)
  let [data, setData] = useStore(key, initialValue, options)
  let [meta, setMeta] = react.useState({
    isLoading: autoload,
    hasLoaded: false,
    filtered: initialValue,
    error: undefined,
    key: getHash(),
  })
  const logAndSetMeta = createLogAndSetMeta({
    log,
    setMeta,
  })

  const handleError = (error = {}) => {
    var errorObj

    if (typeof error === 'object') {
      var { msg, message, data, body, status, statusText } = error
      var errorMessage = msg || message || statusText
      var errorBody = data || body || {}

      if (!status && Number(errorMessage)) {
        status = Number(errorMessage)
        errorMessage = undefined
      }

      errorObj = new Error(errorMessage)
      errorObj.msg = errorMessage
      errorObj.status = status
      Object.keys(errorBody).forEach(key => (errorObj[key] = errorBody[key]))
    } else {
      errorObj = new Error(error)
    }

    log(`${LOG_PREFIX} handleError executed`, {
      errorObj,
    })
    isMounted && logAndSetMeta({ ...meta, isLoading: false, error: errorObj }) // handle authentication errors

    if (typeof onAuthenticationError === 'function' && [401, 403].includes(status)) {
      onAuthenticationError(errorObj)
    } else {
      onError(errorObj)
    }
  }

  const createActionType = (actionOptions = {}) => (item, oldItem) => {
    let itemId = id || (isFixedEndpoint ? undefined : getId(item))
    let { actionType = 'update', method = 'patch' } = actionOptions
    let payload = undefined
    log(actionType.toUpperCase(), 'on', item, 'with id', itemId)

    if (!isFixedEndpoint && !itemId && actionType !== 'create') {
      return autoReject(`Could not ${actionType} item (see log)`, {
        fn: () => {
          onError({
            message: `${LOG_PREFIX} option.getId(item) did not return a valid ID`,
            item,
          })
        },
      })
    }

    if (['update', 'replace'].includes(actionType)) {
      let changes = getPatch(item, oldItem)
      let isPatch = actionType === 'update'

      if (!Object.keys(changes).length) {
        return autoReject('No changes to save')
      }

      payload = isPatch ? changes : item
    }

    if (actionType === 'create') {
      payload = item
      itemId = undefined // don't build a collection/:id endpoint from item itself during POST
    }

    isMounted && logAndSetMeta({ ...meta, isLoading: true })

    const resolve = response => {
      try {
        let newData = response.data

        if (transform) {
          newData = transform(response.data)
          log('AFTER transform:', newData)
        } // these calls only are fired against non-collection endpoints

        if (transformItem) {
          newData = transformItem(newData)
          log('AFTER transformItem:', newData)
        } // short circuit for non-collection calls

        if (!isCollection) {
          log(`non-collection action ${actionType}: setting data to`, item)

          if (actionType === 'remove') {
            onRemove(data)
            return isMounted && setData()
          }

          let updated = mergeOnUpdate ? { ...item, ...newData } : item
          actionType === 'replace' && onReplace(updated) // event

          actionType === 'update' && onUpdate(updated) // event

          isMounted && setData(updated)
          isMounted && logAndSetMeta({ ...meta, isLoading: false, error: undefined, key: getHash() })
          return updated
        }

        if (['update', 'replace'].includes(actionType)) {
          item = mergeOnUpdate ? { ...item, ...newData } : item
          log('updating item in internal collection', item)
          newData = data.map(i => (getId(i) === itemId ? item : i))
          actionType === 'replace' && onReplace(item) // event

          actionType === 'update' && onUpdate(item) // event
        } else if (actionType === 'create') {
          item = mergeOnCreate ? { ...item, ...newData } : item
          log('adding item to internal collection', item)
          newData = [...data, item]
          onCreate(item) // event
        } else if (actionType === 'remove') {
          log('deleting item from internal collection')
          newData = data.filter(i => getId(i) !== itemId)
          onRemove(item) // event
        } // update internal data

        isMounted && setData(newData)
        isMounted && logAndSetMeta({ ...meta, isLoading: false, key: getHash() })
      } catch (err) {
        handleError(err)
      }

      return item
    }

    var thisEndpoint = getEndpoint(endpoint, itemId)

    if (appendSlash && thisEndpoint !== '') {
      thisEndpoint += '/'
    }

    log(`calling "${method}" to`, thisEndpoint, payload) // mock exit for success

    if (mock) {
      return autoResolve('Success!', {
        fn: resolve,
      })
    }

    return axios[method](thisEndpoint, payload, fetchOptions)
      .then(resolve)
      .catch(err => handleError(err.response || err))
  }

  const update = createActionType({
    actionType: 'update',
    method: 'patch',
  })
  const replace = createActionType({
    actionType: 'replace',
    method: 'put',
  })
  const remove = createActionType({
    actionType: 'remove',
    method: 'delete',
  })
  const create = createActionType({
    actionType: 'create',
    method: 'post',
  }) // data load function

  const load = (...loadArgs) => {
    let [loadId, loadOptions] = loadArgs
    let idPassed = loadArgs.length && typeof loadArgs[0] !== 'object'

    if (typeof loadId === 'object' && loadOptions === undefined) {
      // e.g. useHook({ something })
      loadOptions = loadId // use first param as options

      loadId = undefined
    }

    loadOptions = loadOptions || {}
    let opt = { ...options, ...loadOptions }
    let { query, fetchOptions } = opt
    let fetchEndpoint = getEndpoint(endpoint, loadId || id) // if query param is a function, run it to derive up-to-date params

    query = typeof query === 'function' ? query() : query
    log('GET', {
      endpoint: fetchEndpoint,
      query,
    })
    isMounted && logAndSetMeta({ ...meta, isLoading: true, error: undefined })
    return fetchStore
      .get(
        fetchEndpoint,
        {
          params: query,
        },
        fetchOptions
      )
      .then(({ data }) => {
        try {
          if (typeof data !== 'object') {
            return onError('ERROR: Response not in object form... response.data =', data)
          }

          log('GET RESPONSE:', data) // all data gets base transform

          if (transform) {
            data = transform(data)
            log('AFTER transform:', data)
          } // if collection, transform as collection

          if (isCollection && transformCollection) {
            data = transformCollection(data)
            log('AFTER transformCollection:', data)
          }

          if (transformItem) {
            if (isCollection && Array.isArray(data)) {
              data = data.map(transformItem)
            } else {
              data = transformItem(data)
            }

            log('AFTER transformItem:', data)
          }

          if (isMounted) {
            setData(data)
            logAndSetMeta({
              ...meta,
              hasLoaded: true,
              filtered: data,
              // set filtered to loaded data... useEffect will trigger re-render with filtered data
              isLoading: false,
              error: undefined,
              key: getHash(),
            })
            onLoad(data)
          }
        } catch (err) {
          handleError(err)
        }

        return data
      })
      .catch(err => handleError(err.response || err))
  } // EFFECT: UPDATE FILTERED DATA WHEN FILTER OR DATA CHANGES

  react.useEffect(() => {
    // complete avoid this useEffect pass when no filter set or not working on collection
    if (!filter || !isCollection || !Array.isArray(data)) {
      return () => {}
    }

    log('filter changed on datahook', [filter, data])
    var filtered = data
    var prev = meta.filtered

    if (filter) {
      if (typeof filter === 'function') {
        filtered = data.filter(filter)
      } else {
        filtered = data.filter(objectFilter(filter))
      }
    }

    const sameLength = filtered.length === prev.length
    const allMatched = filtered.reduce((acc, item) => {
      return prev.includes(item) && acc
    }, true)

    if (!sameLength || !allMatched) {
      log('changes in filtered results detected, new filtered =', filtered)
      isMounted && logAndSetMeta({ ...meta, filtered, key: getHash() })
    }
  }, [filter, data]) // EFFECT: SET INITIAL LOAD, LOADING INTERVAL, ETC

  react.useEffect(() => {
    let { hasLoaded } = meta

    if (idExplicitlyPassed) {
      log('id changed:', id)
    }

    log('loading check', {
      autoload,
      id,
      idExplicitlyPassed,
      isMounted,
      hasLoaded,
      loadOnlyOnce,
    })

    if (!idExplicitlyPassed || (idExplicitlyPassed && id !== undefined)) {
      // bail if no longer mounted
      if (!isMounted || (loadOnlyOnce && hasLoaded)) {
        log('skipping load', {
          isMounted,
          loadOnlyOnce,
          hasLoaded,
        })
      } else {
        autoload && load()

        if (interval && !loadingInterval) {
          log('adding load interval', interval)
          loadingInterval = setInterval(load, interval)
        }
      }
    }

    if (idExplicitlyPassed && id === undefined && data !== initialValue) {
      setData(initialValue)
    }
  }, [id]) // unmount procedure

  react.useEffect(() => {
    return () => {
      if (loadingInterval) {
        log('clearing load() interval', {
          interval,
        })
        clearInterval(loadingInterval)
      }

      log('unmounting data hook')
      isMountedRef.current = false
    }
  }, [])
  let loadFunction = eventable(load)
  return {
    clearStore: () => clearStore(namespace, false),
    data,
    load: loadFunction,
    refresh: loadFunction,
    create,
    remove,
    update,
    replace,
    ...meta,
  }
}

exports.clearStore = clearStore
exports.createRestHook = createRestHook

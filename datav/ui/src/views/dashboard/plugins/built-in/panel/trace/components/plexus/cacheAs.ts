// Copyright (c) 2019 Uber Technologies, Inc.
//

export function makeCacheScope() {
  const cache = new Map<string, any>()
  return function cacheAs(key: string, value: any) {
    const stored = cache.get(key)
    if (stored) {
      return stored
    }
    cache.set(key, value)
    return value
  }
}

const defaultScope = Object.assign(makeCacheScope(), {
  makeScope: makeCacheScope,
})

export default defaultScope

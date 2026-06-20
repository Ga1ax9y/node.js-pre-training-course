/* eslint-disable @typescript-eslint/no-unused-vars */
// Task 02: Mini functional–utility library
// All helpers are declared but not implemented.

export function mapArray<T, R>(source: readonly T[], mapper: (item: T, index: number) => R): R[] {
  if (source == null)
    throw new TypeError

  const result: R[] = []

  for (let i = 0; i < source.length; ++i) {
    result.push(mapper(source[i], i))
  }

  return result

}

console.log(mapArray([1, 2, 3], n => n * 2))


export function filterArray<T>(source: readonly T[], predicate: (item: T, index: number) => boolean): T[] {
  if (source == null)
    throw new TypeError

  const result: T[] = []

  for (let i = 0; i < source.length; ++i) {
    if (predicate(source[i], i)) {
      result.push(source[i]);
    }
  }

  return result

}

export function reduceArray<T, R>(source: readonly T[], reducer: (acc: R, item: T, index: number) => R, initial: R): R {
  if (source == null)
    throw new TypeError

  let acc = initial

  for (let i = 0; i < source.length; ++i) {
    acc = reducer(acc, source[i], i)
  }

  return acc
}


export function partition<T>(source: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
  if (source == null)
    throw new TypeError

  let first: T[] = []
  let second: T[] = []

  for (let i = 0; i < source.length; ++i) {
    if (predicate(source[i])) {
      first.push(source[i])
    }
    else {
      second.push(source[i])
    }

  }

  return [first, second]
}

export function groupBy<T, K extends PropertyKey>(source: readonly T[], keySelector: (item: T) => K): Record<K, T[]> {
  if (source == null)
    throw new TypeError
  let result: Record<K, T[]> = {} as Record<K, T[]>

  for (let i = 0; i < source.length; ++i) {
    const item = source[i]
    const key = keySelector(item)

    if (result[key] == undefined){
      result[key] = []
    }
    result[key].push(item)

  }
  return result
}

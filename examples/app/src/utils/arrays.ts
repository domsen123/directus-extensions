export const findSave = <T>(array: T[], predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T => {
  const item = array.find(predicate, thisArg)
  if (item) return item
  else throw new Error('Item not found')
}

export const setArray = <T>(array: Ref<T[]>, predicate: (value: T, index: number, obj: T[]) => unknown, item: T): void => {
  const index = array.value.findIndex(predicate)
  if (index === -1) array.value.push(item)
  else array.value[index] = item
}

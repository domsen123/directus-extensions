import { describe, expect, it } from 'vitest'
import { createAsyncHelper } from './async-helper'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('async-helper', () => {
  it('async function should wait for resolve', async () => {
    const helper = createAsyncHelper(() => Promise.resolve('test'), null)
    const result = await helper.load()
    expect(result.value).toEqual('test')
  })

  it('sync function should wait for resolve', async () => {
    const helper = createAsyncHelper(() => Promise.resolve('test'), null)
    const result = helper.resolve()
    expect(result.value).toEqual(null)
  })
  it('wait', async () => {
    const helper = createAsyncHelper(() => Promise.resolve('test'), null)
    const result = helper.resolve()
    expect(result.value).toEqual(null)
    await sleep(10)
    expect(result.value).toEqual('test')
  })
})

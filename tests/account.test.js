const accountService = require('../services/account.services')
const uuidv4 = require('uuid/v4')
// sign up tests
test('create account', async () => {
  expect.assertions(4)
  const randomUser = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  expect(newAccount.data.user.username).toEqual(randomUser)
  expect(newAccount.data.user.password).toEqual('password')
  expect(newAccount.data.user.is_suspended).toEqual(false)
  expect(newAccount.data.user.is_frozen).toEqual(false)
}, 10000)
test('create account with duplicate username', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const new1 = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const new2 = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
// sign in tests
test('sign in', async () => {
  expect.assertions(1)
  const randomUser = uuidv4()
  const newAcc = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const newUser = await accountService.signIn({
    username: randomUser,
    password: 'password'
  })
  expect(newUser.data).not.toBe(null)
}, 10000)
test('sign in with suspended account', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const newAcc = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const suspendAcc = await accountService.suspend({
      toSuspend: true,
      id: newAcc.data.user.id
    })
    const newUser = await accountService.signIn({
      username: randomUser,
      password: 'password'
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
// suspend account test
test('suspend account', async () => {
  expect.assertions(1)
  const randomUser = uuidv4()
  const newAcc = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const suspendAcc = await accountService.suspend({
    toSuspend: true,
    id: newAcc.data.user.id
  })
  expect(suspendAcc.data.result.is_suspended).toBe(true)
}, 10000)
test('suspend suspended account', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const newAcc = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const suspendAcc1 = await accountService.suspend({
      toSuspend: true,
      id: newAcc.data.user.id
    })
    const suspendAcc2 = await accountService.suspend({
      toSuspend: true,
      id: newAcc.data.user.id
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
// freeze account
test('freeze account', async () => {
  expect.assertions(1)
  const randomUser = uuidv4()
  const newAcc = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const frozenAcc = await accountService.freeze({
    toFreeze: true,
    id: newAcc.data.user.id
  })
  expect(frozenAcc.data.result.is_frozen).toBe(true)
}, 10000)
test('unfreeze new account', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const newAcc = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const frozenAcc = await accountService.freeze({
      toFreeze: false,
      id: newAcc.data.user.id
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)

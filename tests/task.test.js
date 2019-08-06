const accountService = require('../services/account.services')
const taskService = require('../services/task.services')
const uuidv4 = require('uuid/v4')
// create task
test('create task', async () => {
  expect.assertions(4)
  const randomUser = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const newTask = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const newTasks = await taskService.view()
  expect(newTask.data.task.author_id).toEqual(newAccount.data.user.id)
  expect(newTask.data.task.name).toEqual('test')
  expect(newTask.data.task.is_frozen).toEqual(false)
  expect(newTask.data.task.is_confirmed).toEqual(false)
}, 10000)
test('create task with frozen author', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const newAccount = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const freezeUser = await accountService.freeze({
      id: newAccount.data.user.id,
      toFreeze: true
    })
    const newTask = await taskService.create({
      authorId: newAccount.data.user.id,
      name: 'test'
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
// edit task
test('edit task', async () => {
  expect.assertions(1)
  const randomUser = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const newTask = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const editTask = await taskService.edit({
    id: newTask.data.task.id,
    name: 'edited'
  })
  expect(editTask.data.result.name).toEqual('edited')
}, 10000)
test('edit frozen task', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const newAccount = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const newTask = await taskService.create({
      authorId: newAccount.data.user.id,
      name: 'test'
    })
    const freezeTask = await taskService.freeze({
      id: newTask.data.task.id,
      toFreeze: true
    })
    const editTask = await taskService.edit({
      id: newTask.data.task.id,
      name: 'edited'
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
// freeze task same test as freeze account
// apply for task
test('apply for task', async () => {
  expect.assertions(1)
  const randomUser = uuidv4()
  const randomApplicant = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const applicant = await accountService.signUp({
    username: randomApplicant,
    password: 'password'
  })
  const newTask = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const applications = await taskService.getApps({ id: newTask.data.task.id })
  const oldLength = applications.data.appl.length
  const applyTask = await taskService.apply({
    taskId: newTask.data.task.id,
    applicantId: applicant.data.user.id
  })
  const newApplications = await taskService.getApps({
    id: newTask.data.task.id
  })
  const newLength = newApplications.data.appl.length
  expect(newLength).toEqual(oldLength + 1)
}, 10000)
test('apply for frozen task', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const randomApplicant = uuidv4()
    const newAccount = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const applicant = await accountService.signUp({
      username: randomApplicant,
      password: 'password'
    })
    const newTask = await taskService.create({
      authorId: newAccount.data.user.id,
      name: 'test'
    })
    const freezeTask = await taskService.freeze({
      id: newTask.data.task.id,
      toFreeze: true
    })
    const applyTask = await taskService.apply({
      taskId: newTask.data.task.id,
      applicantId: applicant.data.user.id
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
// accept applicant
test('accept applicant', async () => {
  expect.assertions(1)
  const randomUser = uuidv4()
  const randomApplicant = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const applicant = await accountService.signUp({
    username: randomApplicant,
    password: 'password'
  })
  const newTask = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const applyTask = await taskService.apply({
    taskId: newTask.data.task.id,
    applicantId: applicant.data.user.id
  })
  const acceptApplicant = await taskService.accept({
    taskId: newTask.data.task.id,
    applicantId: applicant.data.user.id
  })
  expect(acceptApplicant.data.task.assigned_to).toEqual(applicant.data.user.id)
}, 10000)
test('accept user with no application', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const randomApplicant = uuidv4()
    const newAccount = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const applicant = await accountService.signUp({
      username: randomApplicant,
      password: 'password'
    })
    const newTask = await taskService.create({
      authorId: newAccount.data.user.id,
      name: 'test'
    })
    const acceptApplicant = await taskService.accept({
      taskId: newTask.data.task.id,
      applicantId: applicant.data.user.id
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
// submit task
test('submit finished task', async () => {
  expect.assertions(2)
  const randomUser = uuidv4()
  const randomApplicant = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const applicant = await accountService.signUp({
    username: randomApplicant,
    password: 'password'
  })
  const newTask = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const applyTask = await taskService.apply({
    taskId: newTask.data.task.id,
    applicantId: applicant.data.user.id
  })
  const acceptApplicant = await taskService.accept({
    taskId: newTask.data.task.id,
    applicantId: applicant.data.user.id
  })
  const submit = await taskService.submit({
    taskId: newTask.data.task.id,
    text: 'submit text'
  })
  expect(submit.data.submitted_task).toEqual('submit text')
  expect(submit.data.end_date).not.toBe(null)
}, 10000)
test('submit finished task for frozen task', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const randomApplicant = uuidv4()
    const newAccount = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const applicant = await accountService.signUp({
      username: randomApplicant,
      password: 'password'
    })
    const newTask = await taskService.create({
      authorId: newAccount.data.user.id,
      name: 'test'
    })
    const applyTask = await taskService.apply({
      taskId: newTask.data.task.id,
      applicantId: applicant.data.user.id
    })
    const acceptApplicant = await taskService.accept({
      taskId: newTask.data.task.id,
      applicantId: applicant.data.user.id
    })
    const freezeTask = await taskService.freeze({
      id: newTask.data.task.id,
      toFreeze: true
    })
    const submit = await taskService.submit({
      taskId: newTask.data.task.id,
      text: 'submit text'
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
// confirm completed task
test('confirm completed task', async () => {
  expect.assertions(1)
  const randomUser = uuidv4()
  const randomApplicant = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const applicant = await accountService.signUp({
    username: randomApplicant,
    password: 'password'
  })
  const newTask = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const applyTask = await taskService.apply({
    taskId: newTask.data.task.id,
    applicantId: applicant.data.user.id
  })
  const acceptApplicant = await taskService.accept({
    taskId: newTask.data.task.id,
    applicantId: applicant.data.user.id
  })
  const submit = await taskService.submit({
    taskId: newTask.data.task.id,
    text: 'submit text'
  })
  const confirm = await taskService.confirm({
    taskId: newTask.data.task.id
  })
  expect(confirm.data.is_confirmed).toEqual(true)
}, 10000)
test('confirm not completed task', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const randomApplicant = uuidv4()
    const newAccount = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const applicant = await accountService.signUp({
      username: randomApplicant,
      password: 'password'
    })
    const newTask = await taskService.create({
      authorId: newAccount.data.user.id,
      name: 'test'
    })
    const applyTask = await taskService.apply({
      taskId: newTask.data.task.id,
      applicantId: applicant.data.user.id
    })
    const acceptApplicant = await taskService.accept({
      taskId: newTask.data.task.id,
      applicantId: applicant.data.user.id
    })
    const confirm = await taskService.confirm({
      taskId: newTask.data.task.id
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)

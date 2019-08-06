const accountService = require('../services/account.services')
const taskService = require('../services/task.services')
const meetingService = require('../services/meeting.services')
const uuidv4 = require('uuid/v4')
//create meeting
test('create meeting', async () => {
  expect.assertions(5)
  const randomUser = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const newTask = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const newMeeting = await meetingService.create({
    authorId: newAccount.data.user.id,
    taskId: newTask.data.task.id
  })
  expect(newMeeting.data.meeting.is_confirmed).toEqual(false)
  expect(newMeeting.data.meeting.is_frozen).toEqual(false)
  expect(newMeeting.data.meeting.author_id).toEqual(newAccount.data.user.id)
  expect(newMeeting.data.attendance.user_id).toEqual(
    newMeeting.data.meeting.author_id
  )
  expect(newMeeting.data.attendance.is_confirmed).toEqual(true)
}, 10000)
test('create meeting with unmatching tasks', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const randomUser2 = uuidv4()
    const newAccount = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const newAccount2 = await accountService.signUp({
      username: randomUser2,
      password: 'password'
    })
    const newTask = await taskService.create({
      authorId: newAccount.data.user.id,
      name: 'test'
    })
    const newMeeting = await meetingService.create({
      authorId: newAccount2.data.user.id,
      taskId: newTask.data.task.id
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
//edit meeting
test('edit meeting', async () => {
  expect.assertions(2)
  const randomUser = uuidv4()
  const randomUser2 = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const newTask = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const newMeeting = await meetingService.create({
    authorId: newAccount.data.user.id,
    taskId: newTask.data.task.id
  })
  const newAccount2 = await accountService.signUp({
    username: randomUser2,
    password: 'password'
  })
  const newTask2 = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const applyTask = await taskService.apply({
    taskId: newTask2.data.task.id,
    applicantId: newAccount2.data.user.id
  })
  const acceptApplicant = await taskService.accept({
    taskId: newTask2.data.task.id,
    applicantId: newAccount2.data.user.id
  })
  const editMeeting = await meetingService.edit({
    meetingId: newMeeting.data.meeting.id,
    newTasks: [newTask2.data.task.id]
  })
  expect(editMeeting.data.tasks[0].user_id).toEqual(newAccount2.data.user.id)
  expect(editMeeting.data.tasks[0].task_id).toEqual(newTask2.data.task.id)
}, 10000)
test('edit meeting with none existing id', async () => {
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
    const newMeeting = await meetingService.create({
      authorId: -1,
      taskId: newTask.data.task.id
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)
//confirm meeting attendance
test('confirm meeting', async () => {
  expect.assertions(3)
  const randomUser = uuidv4()
  const randomUser2 = uuidv4()
  const newAccount = await accountService.signUp({
    username: randomUser,
    password: 'password'
  })
  const newTask = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const newMeeting = await meetingService.create({
    authorId: newAccount.data.user.id,
    taskId: newTask.data.task.id
  })
  const newAccount2 = await accountService.signUp({
    username: randomUser2,
    password: 'password'
  })
  const newTask2 = await taskService.create({
    authorId: newAccount.data.user.id,
    name: 'test'
  })
  const applyTask = await taskService.apply({
    taskId: newTask2.data.task.id,
    applicantId: newAccount2.data.user.id
  })
  const acceptApplicant = await taskService.accept({
    taskId: newTask2.data.task.id,
    applicantId: newAccount2.data.user.id
  })
  const editMeeting = await meetingService.edit({
    meetingId: newMeeting.data.meeting.id,
    newTasks: [newTask2.data.task.id]
  })
  const confirmMeeting = await meetingService.confirm({
    meetingId: newMeeting.data.meeting.id,
    userId: newAccount2.data.user.id
  })
  expect(confirmMeeting.data.attend.user_id).toEqual(newAccount2.data.user.id)
  expect(confirmMeeting.data.attend.meeting_id).toEqual(
    newMeeting.data.meeting.id
  )
  expect(confirmMeeting.data.attend.is_confirmed).toEqual(true)
}, 10000)
test('confirm meeting not invited', async () => {
  expect.assertions(1)
  try {
    const randomUser = uuidv4()
    const randomUser2 = uuidv4()
    const newAccount = await accountService.signUp({
      username: randomUser,
      password: 'password'
    })
    const newTask = await taskService.create({
      authorId: newAccount.data.user.id,
      name: 'test'
    })
    const newMeeting = await meetingService.create({
      authorId: newAccount.data.user.id,
      taskId: newTask.data.task.id
    })
    const newAccount2 = await accountService.signUp({
      username: randomUser2,
      password: 'password'
    })
    const newTask2 = await taskService.create({
      authorId: newAccount.data.user.id,
      name: 'test'
    })
    const applyTask = await taskService.apply({
      taskId: newTask2.data.task.id,
      applicantId: newAccount2.data.user.id
    })
    const acceptApplicant = await taskService.accept({
      taskId: newTask2.data.task.id,
      applicantId: newAccount2.data.user.id
    })
    const confirmMeeting = await meetingService.confirm({
      meetingId: newMeeting.data.meeting.id,
      userId: newAccount2.data.user.id
    })
  } catch (error) {
    expect(error.message).toEqual('Request failed with status code 400')
  }
}, 10000)

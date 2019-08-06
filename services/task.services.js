const axios = require('axios')
const headers = {
  'Content-Type': 'application/json',
  request_id: 'A-122',
  timestamp: '2016-10-11T18:06',
  channel: 'web'
}

const taskServices = {
  create: async body => {
    const task = await axios.post(
      'http://localhost:5000/api/v1/tasks/create',
      body,
      { headers }
    )
    return task
  },
  edit: async body => {
    const task = await axios.post(
      'http://localhost:5000/api/v1/tasks/edit',
      body,
      { headers }
    )
    return task
  },
  view: async body => {
    const tasks = await axios.post(
      'http://localhost:5000/api/v1/tasks/view',
      body,
      { headers }
    )
    return tasks
  },
  freeze: async body => {
    const task = await axios.post(
      'http://localhost:5000/api/v1/tasks/freeze',
      body,
      { headers }
    )
    return task
  },
  accept: async body => {
    const task = await axios.post(
      'http://localhost:5000/api/v1/tasks/accept',
      body,
      { headers }
    )
    return task
  },
  apply: async body => {
    const task = await axios.post(
      'http://localhost:5000/api/v1/tasks/apply',
      body,
      { headers }
    )
    return task
  },
  submit: async body => {
    const task = await axios.post(
      'http://localhost:5000/api/v1/tasks/submit',
      body,
      { headers }
    )
    return task
  },
  confirm: async body => {
    const task = await axios.post(
      'http://localhost:5000/api/v1/tasks/confirm',
      body,
      { headers }
    )
    return task
  },
  view: async () => {
    const tasks = await axios.post('http://localhost:5000/api/v1/tasks/getAll')
    return tasks
  },
  getById: async body => {
    const task = await axios.post(
      'http://localhost:5000/api/v1/tasks/getId',
      body
    )
    return task
  },
  getApps: async body => {
    const task = await axios.post(
      'http://localhost:5000/api/v1/tasks/getApps',
      body
    )
    return task
  }
}
module.exports = taskServices

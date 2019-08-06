const axios = require('axios')
const headers = {
  'Content-Type': 'application/json',
  request_id: 'A-122',
  timestamp: '2016-10-11T18:06',
  channel: 'web'
}
const meetingServices = {
  create: async body => {
    const meeting = await axios.post(
      'http://localhost:5000/api/v1/meetings/create',
      body,
      { headers }
    )
    return meeting
  },
  edit: async body => {
    const meeting = await axios.post(
      'http://localhost:5000/api/v1/meetings/edit',
      body,
      { headers }
    )
    return meeting
  },
  confirm: async body => {
    const attend = await axios.post(
      'http://localhost:5000/api/v1/meetings/confirm',
      body,
      { headers }
    )
    return attend
  },
  freeze: async body => {
    const meeting = await axios.post(
      'http://localhost:5000/api/v1/meetings/freeze',
      body,
      { headers }
    )
    return meeting
  },
  view: async () => {
    const meetings = await axios.post(
      'http://localhost:5000/api/v1/meetings/getAll'
    )
    return meetings
  },
  getById: async body => {
    const meeting = await axios.post(
      'http://localhost:5000/api/v1/meetings/getId',
      body
    )
    return meeting
  },
  getAttends: async body => {
    const meeting = await axios.post(
      'http://localhost:5000/api/v1/meetings/getAttends',
      body
    )
    return meeting
  }
}
module.exports = meetingServices

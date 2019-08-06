const axios = require('axios')

const headers = {
  'Content-Type': 'application/json',
  request_id: 'A-122',
  timestamp: '2016-10-11T18:06',
  channel: 'web'
}
const accountServices = {
  signUp: async body => {
    const account = await axios.post(
      'http://localhost:5000/api/v1/accounts/signup',
      body,
      { headers }
    )
    return account
  },
  signIn: async body => {
    const token = await axios.post(
      'http://localhost:5000/api/v1/accounts/signin',
      body,
      { headers }
    )
    return token
  },
  suspend: async body => {
    const account = await axios.post(
      'http://localhost:5000/api/v1/accounts/suspend',
      body,
      { headers }
    )
    return account
  },
  freeze: async body => {
    const account = await axios.post(
      'http://localhost:5000/api/v1/accounts/freeze',
      body,
      { headers }
    )
    return account
  },
  view: async () => {
    const accounts = await axios.post(
      'http://localhost:5000/api/v1/accounts/getAll'
    )
    return accounts
  },
  getById: async body => {
    const account = await axios.post(
      'http://localhost:5000/api/v1/accounts/getId',
      body
    )
    return account
  }
}
module.exports = accountServices

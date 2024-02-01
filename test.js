const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-data`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})
tape('get student By Id', async function (t) {
  try {
    const url = `${endpoint}/student/1`
    const { data } = await jsonist.get(url)
    const student = {
      id: 1,
      first_name: 'Scotty',
      last_name: 'Quigley',
      email: 'Scotty79@hotmail.com',
      is_registered: 1,
      is_approved: 1,
      address: '241 Denesik Knolls Apt. 955',
      city: 'Buffalo',
      state: 'ME',
      zip: '04710',
      phone: '1-503-560-6954',
      created: '1628767983203.0',
      last_login: '1628770445749.0',
      ip_address: '2.137.18.155'
    }
    t.deepEqual(data, student, 'should get student by Id 1')
  } catch (e) {
    t.error(e)
  }

  try {
    const url = `${endpoint}/student/_1_`
    const { response } = await jsonist.get(url)
    t.equal(response.statusCode, 404, 'should get 404 when wrong Id passed')
  } catch (e) {
    t.error(e)
  }

  t.end()
})

tape('get student grades report by Id', async function (t) {
  try {
    const url = `${endpoint}/student/1/grades`
    const { data } = await jsonist.get(url)
    const student = {
      id: 1,
      first_name: 'Scotty',
      last_name: 'Quigley',
      email: 'Scotty79@hotmail.com',
      is_registered: 1,
      is_approved: 1,
      address: '241 Denesik Knolls Apt. 955',
      city: 'Buffalo',
      state: 'ME',
      zip: '04710',
      phone: '1-503-560-6954',
      created: '1628767983203.0',
      last_login: '1628770445749.0',
      ip_address: '2.137.18.155',
      grades: [
        {
          course: 'Calculus',
          grade: 50
        },
        {
          course: 'Microeconomics',
          grade: 43
        },
        {
          course: 'Statistics',
          grade: 50
        },
        {
          course: 'Astronomy',
          grade: 63
        }
      ]
    }
    t.deepEqual(data, student, 'should get student report by Id 1')
  } catch (e) {
    t.error(e)
  }

  try {
    const url = `${endpoint}/student/_1_/grades`
    const { response } = await jsonist.get(url)
    t.equal(response.statusCode, 404, 'should get 404 when wrong Id passed')
  } catch (e) {
    t.error(e)
  }

  t.end()
})

tape('get course grades report', async function (t) {
  try {
    const url = `${endpoint}/course/all/grades`
    const { data } = await jsonist.get(url)
    const courses = [
      {
        course: 'Astronomy',
        highest_grade: 100,
        lowest_grade: 0,
        average_grade: 50.03889013536759
      },
      {
        course: 'Calculus',
        highest_grade: 100,
        lowest_grade: 0,
        average_grade: 50.09270747689165
      },
      {
        course: 'Microeconomics',
        highest_grade: 100,
        lowest_grade: 0,
        average_grade: 49.81138092966023
      },
      {
        course: 'Philosophy',
        highest_grade: 100,
        lowest_grade: 0,
        average_grade: 50.01606355689488
      },
      {
        course: 'Statistics',
        highest_grade: 100,
        lowest_grade: 0,
        average_grade: 50.017376820961566
      }
    ]
    t.deepEqual(data, courses, 'should get report')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})

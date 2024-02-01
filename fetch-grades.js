const request = require('request')
const knex = require('./db')

request('https://outlier-coding-test-data.onrender.com/grades.json', async (error, response, body) => {
  if (error || response.statusCode !== 200) throw Error('Error in loading grads')
  try {
    const grades = JSON.parse(body)

    await knex.schema.dropTableIfExists('student_grades')
    await knex.schema.createTable('student_grades', function (t) {
      t.integer('id').defaultTo(null)
      t.integer('grade').defaultTo(null)
      t.string('course', 50).defaultTo(null)
    })
    await knex.batchInsert('student_grades', grades, 100)
    await knex.schema.table('student_grades', (tableBuilder) => {
      tableBuilder.renameColumn('id', 'student_id')
    })
  } catch (e) {
    console.error(e)
  }
  process.exit()
})

console.log('Fetching grades...')

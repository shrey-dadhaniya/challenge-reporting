const knex = require('./db')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    await knex('student_grades').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  try {
    const { id } = req.params
    const student = await knex('students').where('id', id).first()

    if (!student) return res.status(404).json({ error: 'Student Not Found' })

    delete student.password_hash

    res.status(200).json(student).end()
  } catch (e) {
    next(e)
  }
}

async function getStudentGradesReport (req, res, next) {
  try {
    const { id } = req.params
    const [student, studentGrades] = await Promise.all([
      knex('students').where('id', id).first(),
      knex('student_grades').where('student_id', id)
    ])

    if (!student) return res.status(404).json({ error: 'Student Not Found' })

    delete student.password_hash

    student.grades = studentGrades.map(x => ({ course: x.course, grade: x.grade })) || []

    res.status(200).json(student).end()
  } catch (e) {
    next(e)
  }
}

async function getCourseGradesReport (req, res, next) {
  try {
    const courses = await knex('student_grades')
      .select(
        'course',
        knex.raw('MAX(grade) as highest_grade'),
        knex.raw('MIN(grade) as lowest_grade'),
        knex.raw('AVG(grade) as average_grade'))
      .groupBy('course')

    res.status(200).json(courses).end()
  } catch (e) {
    next(e)
  }
}

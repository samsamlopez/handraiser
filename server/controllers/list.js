function getAllStudents(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;

  db.query(
    `SELECT users.id, users.first_name, users.last_name, users.avatar,users.sub,cohorts.password FROM member LEFT JOIN users ON member.student_id = users.id LEFT JOIN cohorts ON member.cohort_id = cohorts.id WHERE member.cohort_id = ${id};`
  )
    .then(students => {
      res.status(201).json({ students });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

module.exports = {
  getAllStudents
};

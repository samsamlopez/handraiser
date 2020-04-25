const jwt = require("jsonwebtoken");

function signIn(req, res) {
  const db = res.app.get("db");

  const { username, password } = req.body;

  db.admin
    .findOne({
      username,
      password
    })
    .then(admin => {
      if (!admin) {
        res.status(201).send({ token: null });
      }
      const token = jwt.sign({ adminId: admin.id }, "5up324pp11c4710n53c237");
      delete admin.password;
      res.status(201).send({ token });
    })
    .catch(err => {
      if (["Invalid username", "Incorrect password"].includes(err.message)) {
        console.error(err);
        res.status(400).send({ error: err.message });
      } else {
        res.status(500).end();
      }
    });
}

function adminDetails(req, res) {
  const db = res.app.get("db");
  const { id } = req.params;

  db.query(`SELECT * FROM admin WHERE id = 1`)
    .then(admin => {
      res.status(201).send({ admin });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function changePassword(req, res) {
  const db = res.app.get("db");
  const { newpassword } = req.body;
  const { id } = req.params;

  db.query(`UPDATE admin set password = '${newpassword}' WHERE id = ${id}`)
    .then(admin => {
      res.status(201).send({ admin });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function generateNewKey(req, res) {
  const db = res.app.get("db");

  const { generatedKey } = req.body;

  db.keys
    .insert({
      sign_in_key: generatedKey,
      sub: null
    })
    .then(key => {
      res.status(201).send({ key });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function generatedKeys(req, res) {
  const db = res.app.get("db");

  db.query(`SELECT * FROM keys ORDER BY id desc`)
    .then(keys => {
      res.status(201).send({ keys });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function mentors(req, res) {
  const db = res.app.get("db");

  db.query(
    `SELECT * FROM users WHERE privilege = 'mentor' ORDER BY first_name asc`
  )
    .then(mentors => {
      res.status(201).send({ mentors });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function cohorts(req, res) {
  const db = res.app.get("db");

  db.query(`SELECT * FROM cohorts ORDER BY name asc`)
    .then(cohorts => {
      res.status(201).send({ cohorts });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function students(req, res) {
  const db = res.app.get("db");

  db.query(`SELECT * FROM member ORDER BY id desc`)
    .then(students => {
      res.status(201).send({ students });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function cohortList(req, res) {
  const db = res.app.get("db");

  const { mentorId } = req.params;

  db.query(
    `SELECT * FROM cohorts, users WHERE cohorts.mentor_id = users.id AND cohorts.mentor_id = ${mentorId} ORDER BY cohorts.name asc`
  )
    .then(cohorts => {
      res.status(201).send({ cohorts });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function studentList(req, res) {
  const db = res.app.get("db");

  const { cohortId } = req.params;

  db.query(
    `SELECT * FROM member, users WHERE member.student_id = users.id AND member.cohort_id = ${cohortId} ORDER BY users.first_name asc`
  )
    .then(students => {
      res.status(201).send({ students });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function filterByStatus(req, res) {
  const db = res.app.get("db");

  const { status } = req.params;

  if (status === "all") {
    db.query(`SELECT * FROM keys ORDER BY id desc`).then(keys => {
      res.status(201).send({ keys });
    });
  } else if (status === "available") {
    db.query(`SELECT * FROM keys WHERE sub IS NULL ORDER BY id desc`).then(
      keys => {
        res.status(201).send({ keys });
      }
    );
  } else {
    db.query(`SELECT * FROM keys WHERE sub IS NOT NULL ORDER BY id desc`).then(
      keys => {
        res.status(201).send({ keys });
      }
    );
  }
}

function sortByMentor(req, res) {
  const db = res.app.get("db");

  const { sortMentor } = req.params;

  if (sortMentor === "true") {
    db.query(
      `SELECT cohorts.id "id", cohorts.mentor_id, cohorts.name FROM cohorts, users WHERE cohorts.mentor_id = users.id ORDER BY users.first_name asc`
    ).then(cohorts => {
      res.status(201).send({ cohorts });
    });
  } else {
    db.query(
      `SELECT cohorts.id "id", cohorts.mentor_id, cohorts.name FROM cohorts, users WHERE cohorts.mentor_id = users.id ORDER BY users.first_name desc`
    ).then(cohorts => {
      res.status(201).send({ cohorts });
    });
  }
}

module.exports = {
  signIn,
  adminDetails,
  changePassword,
  generateNewKey,
  generatedKeys,
  mentors,
  cohorts,
  students,
  cohortList,
  studentList,
  filterByStatus,
  sortByMentor
};

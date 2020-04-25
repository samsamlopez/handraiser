var fs = require("fs");

function getAll(req, res) {
  const db = req.app.get("db");

  db.query(
    `SELECT cohorts.id, cohorts.mentor_id, cohorts.name, cohorts.password, cohorts.status, cohorts.class_header, users.first_name, users.last_name, users.avatar, (SELECT COUNT(*) FROM member WHERE member.cohort_id = cohorts.id )
    AS members FROM cohorts, users WHERE cohorts.mentor_id = users.id ORDER BY cohorts.status, cohorts.id DESC`
  )
    .then(cohorts => {
      res.status(201).json({ cohorts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getByMentorID(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;

  db.query(
    `SELECT cohorts.id, cohorts.mentor_id, cohorts.name, cohorts.password, users.first_name, users.last_name, users.avatar, (SELECT COUNT(*) FROM member WHERE member.cohort_id = cohorts.id ) AS members FROM cohorts LEFT JOIN users ON users.id = cohorts.mentor_id WHERE mentor_id = ${id} ORDER BY cohorts.name ASC`
  )
    .then(cohorts => {
      res.status(201).json({ cohorts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getEnrolledClasses(req, res) {
  const db = req.app.get("db");
  const { studentId } = req.params;

  db.query(
    `SELECT cohorts.id, cohorts.mentor_id, cohorts.name, cohorts.status, cohorts.password, cohorts.status, cohorts.class_header, users.first_name, users.last_name, users.avatar, (SELECT COUNT(*) FROM member WHERE member.cohort_id = cohorts.id )
    AS members FROM cohorts, users, member WHERE cohorts.mentor_id = users.id AND member.cohort_id = cohorts.id AND member.student_id = '${studentId}' ORDER BY cohorts.id DESC;`
  )
    .then(cohorts => {
      res.status(201).json({ cohorts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function addCohort(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;
  const { name, password } = req.body;

  db.query(
    `INSERT INTO cohorts (mentor_id, name, password, status) VALUES (${id}, '${name}', '${password}', 'active')`
  )
    .then(cohort => {
      res.status(201).json({ cohort });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function deleteCohort(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;
  const { classHeader } = req.body;

  db.query(
    `
    DELETE FROM chat WHERE cohort_id = '${id}';
    DELETE FROM member WHERE cohort_id = ${id};
    DELETE FROM cohorts WHERE id = ${id};`
  )
    .then(cohort => {
      res.status(201).json({ cohort });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getCohortsByStudentID(req, res) {
  const db = req.app.get("db");

  db.query(`SELECT * from member`)
    .then(member => {
      res.status(201).json({ member });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function enroll(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;
  const { student_id, password } = req.body;

  db.query(`SELECT status FROM cohorts WHERE id = '${id}'`).then(cohort => {
    if (cohort[0] === undefined) {
      res.status(201).send({ message: "Deleted" });
    } else {
      if (cohort[0].status === "active") {
        db.cohorts
          .findOne({
            id,
            password
          })
          .then(cohort => {
            if (!cohort) {
              res.status(201).send({ message: "error" });
            } else {
              db.member
                .insert({
                  student_id: student_id,
                  cohort_id: id
                })
                .then(member => {
                  res.status(201).json({ member });
                });
            }
          })
          .catch(err => {
            console.log(err);
            res.status(201).send({ message: err });
          });
      } else {
        res.status(201).send({ message: "Locked" });
      }
    }
  });
}

function leave(req, res) {
  const db = req.app.get("db");
  const { cid, sid } = req.params;

  db.query(
    `SELECT id FROM member WHERE student_id = ${sid} AND cohort_id = ${cid}`
  ).then(member => {
    db.query(
      `
        DELETE FROM requests WHERE member_id = ${member[0].id};
        DELETE FROM member WHERE student_id = ${sid} AND cohort_id = ${cid};
      `
    )
      .then(member => {
        res.status(201).json({ member });
      })
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
  });
}

function getAllMentors(req, res) {
  const db = req.app.get("db");

  db.query(`SELECT * FROM users WHERE privilege = 'mentor'`)
    .then(mentor => {
      res.status(201).json({ mentor });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getMentorCohortsByName(req, res) {
  const db = req.app.get("db");
  const { value, id } = req.params;

  db.query(
    `SELECT cohorts.id, cohorts.mentor_id, cohorts.name, cohorts.password, users.first_name, users.last_name, users.avatar, (SELECT COUNT(*) FROM member WHERE member.cohort_id = cohorts.id ) AS members FROM cohorts LEFT JOIN users ON users.id = cohorts.mentor_id WHERE mentor_id = ${id} AND LOWER(cohorts.name) LIKE LOWER('%${value}%')`
  )
    .then(cohorts => {
      res.status(201).json({ cohorts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getAllCohortsByName(req, res) {
  const db = req.app.get("db");
  const { value } = req.params;

  db.query(
    `SELECT cohorts.id, cohorts.mentor_id, cohorts.name, cohorts.password, cohorts.status, users.first_name, users.last_name, users.avatar, (SELECT COUNT(*) FROM member WHERE member.cohort_id = cohorts.id ) AS members FROM cohorts LEFT JOIN users ON cohorts.mentor_id = users.id WHERE LOWER(cohorts.name) LIKE LOWER('%${value}%') ORDER BY cohorts.id DESC`
  )
    .then(cohorts => {
      res.status(201).json({ cohorts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getStudentsByClass(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;

  db.query(
    `SELECT member.student_id, member.cohort_id, users.first_name, users.last_name, users.avatar FROM member, users WHERE member.student_id = users.id AND cohort_id = ${id} ORDER BY users.last_name ASC;`
  )
    .then(students => {
      res.status(201).json({ students });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getAllSideNav(req, res) {
  const db = req.app.get("db");
  db.query(
    `SELECT cohorts.id, cohorts.mentor_id, cohorts.name, cohorts.password, users.first_name, users.last_name, users.avatar, (SELECT COUNT(*) FROM member WHERE member.cohort_id = cohorts.id ) AS members FROM cohorts LEFT JOIN users ON cohorts.mentor_id = users.id ORDER by cohorts.name asc`
  )
    .then(cohorts => {
      res.status(201).json({ cohorts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function changeStatus(req, res) {
  const db = req.app.get("db");
  const { id, status } = req.params;

  db.query(`UPDATE cohorts SET status = '${status}' WHERE id = '${id}'`)
    .then(status => {
      res.status(201).json({ status });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getCohortDetails(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;

  db.query(`SELECT * FROM cohorts WHERE id = ${id}`)
    .then(cohort => {
      res.status(201).json({ cohort });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function updateCohortDetails(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;
  const { name, newpassword, status } = req.body;

  db.query(
    `UPDATE cohorts SET name = '${name}', password = '${newpassword}', status = '${status}' WHERE id = '${id}'`
  )
    .then(status => {
      res.status(201).json({ status });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getHistory(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;

  db.query(`SELECT * FROM history WHERE cohort_id = ${id}`)
    .then(history => {
      res.status(201).json({ history });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getHistoryById(req, res) {
  const db = req.app.get("db");
  const { cohort, student } = req.params;

  db.query(
    `SELECT history.id, history.reason, history.mentor_id, history.time, cohorts.name FROM history, cohorts WHERE history.cohort_id = ${cohort} and history.member_id = ${student} and history.cohort_id = cohorts.id`
  )
    .then(history => {
      res.status(201).json({ history });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getHistoryDetails(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;
  db.query(
    `select * from users, history where history.id = ${id} and history.member_id = users.id`
  )
    .then(history => {
      res.status(201).json({ history });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function getHelpedBy(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;

  db.query(`select * from users where id = ${id}`)
    .then(mentor => {
      res.status(201).json({ mentor });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

module.exports = {
  getAll,
  getByMentorID,
  addCohort,
  deleteCohort,
  getCohortsByStudentID,
  enroll,
  leave,
  getAllMentors,
  getMentorCohortsByName,
  getAllCohortsByName,
  getStudentsByClass,
  getAllSideNav,
  changeStatus,
  updateCohortDetails,
  getCohortDetails,
  getEnrolledClasses,
  getHistory,
  getHistoryDetails,
  getHelpedBy,
  getHistoryById
};

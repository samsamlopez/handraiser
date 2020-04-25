module.exports = {
  helpStudent: (req, res) => {
    const db = req.app.get("db");
    const { memberid, cohort_id, assistid } = req.params;

    db.member
      .findOne({ student_id: memberid, cohort_id: cohort_id })
      .then(member => {
        db.query(
          `UPDATE requests SET status = 'inprogress',assist_id = ${assistid}  WHERE member_id=${member.id}`
        ).then(() => {
          db.query(
            `SELECT users.*, requests.status,requests.assist_id, member.cohort_id FROM users, member, requests WHERE users.id = member.student_id AND member.id = requests.member_id AND users.privilege='student' AND member.cohort_id=${cohort_id} and requests.status = 'inprogress'`
          ).then(student => {
            return res.status(200).send(student);
          });
        });
      });
  }, 
  movebacktoqueu: (req, res) => {
    const db = req.app.get("db");
    const { memberid, cohort_id } = req.params;

    db.member
      .findOne({ student_id: memberid, cohort_id: cohort_id })
      .then(member => {
        db.query(
          `UPDATE requests SET status = 'waiting', assist_id = null WHERE member_id=${member.id}`
        ).then(() => {
          db.query(
            `SELECT users.*, requests.status FROM users, member, requests WHERE users.id = member.student_id AND member.id = requests.member_id AND users.privilege='student' AND member.cohort_id=${cohort_id}`
          ).then(student => {
            return res.status(200).send(student);
          });
        });
      });
  },
  doneHelp: (req, res) => {
    const db = req.app.get("db");
    const { memberid, cohort_id, mentor_id } = req.params;
    const { time } = req.body;
    db.query(
      `SELECT reasons.reason FROM requests, reasons,member WHERE reasons.request_id = requests.id AND requests.member_id = member.id AND member.student_id = ${memberid}`
    ).then(reason => {
      db.query(
        `INSERT INTO history (member_id, cohort_id, mentor_id, time, reason) VALUES (${memberid}, ${cohort_id}, ${mentor_id}, '${time}', '${reason[0].reason}')`
      ).then(() => {
        db.member
          .findOne({ student_id: memberid, cohort_id: cohort_id })
          .then(member => {
            db.query(
              `DELETE from requests WHERE member_id = ${member.id}`
            ).then(() => {
              db.query(
                `SELECT users.*, requests.status FROM users, member, requests WHERE users.id = member.student_id AND member.id = requests.member_id AND users.privilege='student' AND member.cohort_id=${cohort_id}  order by requests.id asc`
              ).then(result => {
                res.status(201).json([...result]);
              });
            });
          });
      });
    });
  }
};

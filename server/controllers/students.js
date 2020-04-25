function displayUserInfo(req, res) {
  const db = req.app.get("db");
  const { sub, cohort_id } = req.params;

  db.query(
    `SELECT users.*, cohorts.name FROM users, member, cohorts WHERE users.id=member.student_id AND cohorts.id=member.cohort_id AND users.sub = '${sub}' and cohorts.id = ${cohort_id}`
  ).then(user => {
    if (user.length > 0) {
      res.status(200).json([user]);
    } else {
      db.query(
        `SELECT users.*, cohorts.name FROM users, cohorts WHERE users.id=cohorts.mentor_id AND users.sub = '${sub}' and cohorts.id = ${cohort_id}`
      ).then(mentor => {
        if (mentor.length > 0) {
          res.status(200).json([mentor]);
        } else {
          db.query(
            `SELECT users.*, cohorts.* FROM users,cohorts, comentor WHERE users.id=comentor.mentor_id AND users.sub = '${sub}' and cohorts.id = ${cohort_id}`
          ).then(comentor => {
            res.status(200).json([comentor]);
          })
        }
      });
    }
  });

  // db.users
  //     .findOne({sub:sub})
  //     .then(user => {
  //         res.status(200).json([user])
  //     })
}

function displayStudents(req, res) {
  const db = req.app.get("db");

  db.query(
    `SELECT users.*, requests.status,reasons.reason, member.cohort_id FROM reasons, users, member, requests WHERE requests.id = reasons.request_id AND users.id = member.student_id AND member.id = requests.member_id AND users.privilege='student' order by requests.id asc`
  ).then(members => {
    res.status(200).json([...members]);
  });
}

function requestHelp(req, res) {
  const db = req.app.get("db");
  const { sub, cohort_id } = req.params;
  const { reason } = req.body;
  db.users
    .findOne({ sub: sub })
    .then(function (data) {
      db.member
        .findOne({ student_id: data.id, cohort_id: cohort_id })
        .then(function (member) {
          db.requests
            .insert({
              member_id: member.id,
              status: "waiting"
            })
            .then(user => {
              db.reasons
                .insert({
                  request_id: user.id,
                  reason
                })
                .then(() => {
                  db.requests
                    .findOne({ member_id: user.member_id })
                    .then(mem => {
                      db.member.findOne({ id: mem.member_id }).then(memb => {
                        db.query(
                          `SELECT users.*, requests.status,reasons.reason, member.cohort_id FROM reasons, users, member, requests WHERE users.id = member.student_id AND member.id = requests.member_id AND users.privilege='student' AND requests.id = reasons.request_id AND member.cohort_id=${memb.cohort_id}  order by requests.id asc`
                        ).then(result => {
                          res.status(201).json([...result]);
                        });
                      });
                    });
                });
            });
        });
    })
    .catch(() => {
      res.status(500).end();
    });
}
  
function deleteRequest(req, res) {
  const db = req.app.get("db");
  const { student_id, cohort_id } = req.params;

  db.member
    .findOne({ student_id: student_id, cohort_id: cohort_id })
    .then(student => {
      db.query(`DELETE from requests WHERE member_id = ${student.id}`).then(
        () => {
          db.query(
            `SELECT users.*, requests.status FROM users, member, requests WHERE users.id = member.student_id AND member.id = requests.member_id AND users.privilege='student' AND member.cohort_id=${cohort_id}  order by requests.id asc`
          ).then(result => {
            res.status(201).json([...result]);
          });
        }
      );
    })
    .catch(() => {
      res.status(500).end();
    });
}

function displayChatUserInfo(req, res) {
  const db = req.app.get("db");
  const { student_sub, mentor_sub } = req.params;

  db.query(
    `SELECT * FROM users WHERE users.sub = '${student_sub}' OR users.sub='${mentor_sub}'`
  ).then(user => {
    res.status(200).json([...user]);
  });
}

function sendChat(req, res) {
  const db = req.app.get("db");
  const message = req.body.message;
  const sender_id = req.body.sender_sub;
  const chatmate_id = req.body.chatmate_sub;
  const cohort_id = req.body.cohort_id;
  const time = req.body.time;
  const type = req.body.type;
  const link = req.body.link;

  db.chat
    .insert({
      message: message,
      sender_id: sender_id,
      chatmate_id: chatmate_id,
      cohort_id: `${cohort_id}`,
      time: time,
      seen: 0,
      chat_type: type,
      link: link
    })
    .then(() => {
      db.query(`SELECT * from chat ORDER BY id ASC`).then(chats => {
        res.status(201).json(chats);
      });
    });
}

function getChat(req, res) {
  const db = req.app.get("db");

  db.query(`SELECT * from chat ORDER BY id ASC`).then(chats => {
    res.status(201).json(chats);
  });
}

function displayMentor(req, res) {
  const db = req.app.get("db");
  const { cohort_id } = req.params;
  let mentor = [];

  db.query(`SELECT mentor_id FROM cohorts WHERE id = ${cohort_id} UNION SELECT mentor_id FROM comentor WHERE cohort_id = ${cohort_id}`)
    .then((mentor_id) => {
      mentor_id.map(id => {
        db.users.findOne({ id: id.mentor_id }).then(user => {
          mentor.push(user)
        }).then(()=> {
          if(mentor_id.length === mentor.length){
            res.status(200).json([...mentor]);
          }
        })
      })
    })
}

function seenChat(req, res) {
  const db = req.app.get("db");
  const student = req.body.student;
  const mentor = req.body.mentor;
  const { priv } = req.params;

  if (priv === 'student') {
    db.query(
      `UPDATE chat SET seen=1 WHERE chatmate_id='${student}' AND sender_id='${mentor}'`
    ).then(() => {
      db.query(`SELECT * from chat ORDER BY id ASC`).then(chats => {
        res.status(201).json(chats);
      });
    });
  } else if (priv === 'mentor') {
    db.query(
      `UPDATE chat SET seen=1 WHERE sender_id='${mentor}' AND chatmate_id='${student}'`
    ).then(() => {
      db.query(`SELECT * from chat ORDER BY id ASC`).then(chats => {
        res.status(201).json(chats);
      });
    });
  }

}

function deleteMessage(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;

  db.query(`DELETE FROM chat WHERE id = ${id}`)
  .then(()=> {
    db.query(`SELECT * FROM chat ORDER BY id ASC`)
    .then(chats => {
      res.status(200).json(chats)
    })
  })
  .catch(()=>{
    res.status(500).end()
  })
}

module.exports = {
  displayUserInfo,
  displayStudents,
  requestHelp,
  deleteRequest,
  displayChatUserInfo,
  sendChat,
  getChat,
  displayMentor,
  seenChat,
  deleteMessage
};

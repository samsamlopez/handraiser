function validate(req, res) {
  const db = req.app.get("db");

  const { key } = req.body;
  db.keys
    .findOne({
      sign_in_key: key
    })
    .then(key => {
      res.status(201).send({ key });
    })
    .catch(err => {
      console.log(err);
      res.status(501).end();
    });
}

function signIn(req, res) {
  const db = req.app.get("db");

  const { key, first_name, last_name, sub, privilege, avatar } = req.body;

  db.keys
    .findOne({
      sub
    })
    .then(checkSub => {
      if (checkSub === null) {
        db.users
          .findOne({
            sub
          })
          .then(user => {
            if (user === null) {
              db.query(
                `SELECT * FROM keys WHERE sub IS NOT NULL AND sign_in_key = '${key}' AND sub NOT IN (SELECT sub FROM keys WHERE sub = '${sub}' AND sign_in_key = '${key}')`
              ).then(validatedKey => {
                if (validatedKey.length === 0) {
                  db.query(
                    `UPDATE keys SET sub = '${sub}' WHERE sign_in_key = '${key}'`
                  ).then(keys => {
                    db.users
                      .findOne({
                        avatar
                      })
                      .then(user => {
                        if (!user) {
                          db.users
                            .insert({
                              first_name,
                              last_name,
                              sub,
                              privilege,
                              avatar,
                              status: 'active'
                            })
                            .then(user => {
                              res.status(201).send({ user });
                            });
                        } else {
                          res.status(201).send({ user });
                        }
                      });
                  });
                } else {
                  if (validatedKey[0].sub === sub) {
                    db.users
                      .findOne({
                        avatar
                      })
                      .then(user => {
                        if (!user) {
                          db.users
                            .insert({
                              first_name,
                              last_name,
                              sub,
                              privilege,
                              avatar
                            })
                            .then(user => {
                              res.status(201).send({ user });
                            });
                        } else {
                          user.key = validatedKey[0].sign_in_key;
                          res.status(201).send({ user });
                        }
                      });
                  } else {
                    const user = {
                      sub: validatedKey[0].sub,
                      key: validatedKey[0].sign_in_key,
                      privilege: "mentor"
                    };
                    res.status(201).send({ user });
                  }
                }
              });
            } else {
              const user = {
                privilege: "student"
              };
              res.status(201).send({ user });
            }
          });
      } else {
        const user = {
          sub: checkSub.sub,
          key: checkSub.sign_in_key,
          privilege: "mentor"
        };
        res.status(201).send({ user });
      }
    });
}

function updateStatus(req, res) {
  const db = req.app.get("db");
  const { sub, status } = req.params;
  db.query(`UPDATE users set status = '${status}' WHERE sub = '${sub}'`).then(resp => {
    db.query(`SELECT * FROM users WHERE sub = '${sub}'`).then(user => {
      res.status(200).send({ user });
    });
  });
}

function getFromSub(req, res) {
  const db = req.app.get("db");
  const { id } = req.params;

  db.query(`SELECT * FROM users WHERE sub = '${id}'`).then(user => {
    res.status(201).send({ user });
  });
}

function getOnline(req, res) {
  const db = req.app.get("db");

  db.query(`SELECT * FROM users WHERE status = 'active'`).then(users => {
    res.status(201).send({ users });
  });
}


module.exports = {
  validate,
  signIn,
  getFromSub,
  updateStatus,
  getOnline
};

function image(req, res) {
  const db = req.app.get("db");
  const { cohortId } = req.params;
  const { url } = req.body;

  db.query(
    `UPDATE cohorts SET class_header = '${url}' WHERE id = '${cohortId}'`
  )
    .then(cohorts => {
      res.status(201).json({ cohorts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function cohort(req, res) {
  const db = req.app.get("db");
  const { cohortId } = req.params;

  db.query(`SELECT class_header FROM cohorts WHERE id = '${cohortId}'`)
    .then(class_header => {
      res.status(201).send(class_header);
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

function setToDefault(req, res) {
  const db = req.app.get("db");
  const { cohortId } = req.params;

  db.query(`UPDATE cohorts SET class_header = null WHERE id = '${cohortId}'`)
    .then(class_header => {
      res.status(201).send(class_header);
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
}

module.exports = {
  image,
  cohort,
  setToDefault
};

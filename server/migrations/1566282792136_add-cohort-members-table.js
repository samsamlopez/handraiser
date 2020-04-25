exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('member', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    student_id: {
      type: 'integer',
      notNull: true,
      references: '"users"'
    },
    cohort_id: {
      type: 'integer',
      notNull: true,
      references: '"cohorts"'
    }
  })
};

exports.down = (pgm) => {

};

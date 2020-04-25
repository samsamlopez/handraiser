exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("comentor", {
    id: {
      type: "serial",
      primaryKey: true
    },
    mentor_id: {
      type: "integer",
      notNull: true,
      references: '"users"'
    },
    cohort_id: {
      type: "integer",
      notNull: true,
      references: '"cohorts"',
      onDelete: "cascade"
    }
  });
};

exports.down = pgm => {};

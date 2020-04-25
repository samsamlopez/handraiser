exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("cohorts", {
    id: {
      type: "serial",
      primaryKey: true
    },
    mentor_id: {
      type: "integer",
      notNull: true,
      references: '"users"'
    },
    name: {
      type: "text",
      notNull: true
    },
    password: {
      type: "text",
      notNull: true
    },
    status: {
      type: "text",
      notNull: true
    },
  });
};

exports.down = pgm => {};

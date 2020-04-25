exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("reasons", {
    id: {
      type: "serial",
      primaryKey: true
    },
    request_id: {
      type: "integer",
      notNull: true,
      references: '"requests"',
      onDelete: "cascade"
    },
    reason: {
      type: "text",
      notNull: true
    }
  });
};

exports.down = pgm => {};

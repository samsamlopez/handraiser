exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("admin", {
    id: {
      type: "serial",
      primaryKey: true
    },
    username: {
      type: "text",
      notNull: true
    },
    password: {
      type: "text",
      notNull: true
    }
  });

  pgm.sql("insert into admin (username,password) values('admin','Admin123')");
};

exports.down = pgm => {};

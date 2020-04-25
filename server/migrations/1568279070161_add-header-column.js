exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns("cohorts", {
        class_header: {
            type: "text",
            notNull: false
        }
    });
  };

exports.down = (pgm) => {

};

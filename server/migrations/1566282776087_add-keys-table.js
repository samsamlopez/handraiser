exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('keys', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    sign_in_key: {
      type: 'text',
      notNull: true,
    },
    sub: {
      type: 'text',
      notNull: false,
    },
  })
};

exports.down = (pgm) => {

};

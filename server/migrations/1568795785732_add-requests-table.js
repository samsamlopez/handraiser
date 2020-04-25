exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('requests', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    member_id: {
      type: 'integer',
      notNull: true,
      references: '"member"',
      onDelete: "cascade"
    },
    status: {
      type: 'text',
      notNull: true
    },
    assist_id:{
      type: 'integer'
    }
  })
};

exports.down = (pgm) => {

};

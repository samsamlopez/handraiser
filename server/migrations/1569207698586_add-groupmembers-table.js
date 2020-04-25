exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("groupmembers", {
        id: {
            type: "serial",
            primaryKey: true
        },
        member_sub: {
            type: "text",
            notNull: true,
        },
        groupchat_id: {
            type: "integer",
            notNull: true,
            references: '"groupchat"',
        }
    })
};

exports.down = (pgm) => {

};

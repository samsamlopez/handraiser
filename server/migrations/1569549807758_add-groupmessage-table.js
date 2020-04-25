exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("groupmessage", {
        id: {
            type: "serial",
            primaryKey: true
        },
        sender_sub: {
            type: "text",
            notNull: true
        },
        groupchat_id: {
            type: "integer",
            notNull: true,
            references: '"groupchat"',
        },
        message: {
            type: "text",
            notNull: true
        },
        time: {
            type: "text",
            notNull: "true"
        },
        seen: {
            type: "text",
            notNull: true
        },
        chat_type: {
            type: "text",
            default: "text",
            notNull: true
        },
        link: {
            type: "text",
            default: null
        }
    })
};

exports.down = (pgm) => {

};

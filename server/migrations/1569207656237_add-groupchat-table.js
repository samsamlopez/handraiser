exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("groupchat", {

        id: {
            type: "serial",
            primaryKey: true
        },
        user_sub: {
            type: "text",
            notNull: true,
        },
        name: {
            type: "text",
            notNull: true,
        }
        
    })
};

exports.down = (pgm) => {

};

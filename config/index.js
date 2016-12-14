module.exports = {
    secrets: {
        session: process.env.SECRET_SESSION || '52845d1e-14a8-4569-a355-f1963917da9'
    },
    databaseConnectionString: process.env.DATABASE_URL || 'postgres://dev:123456@localhost:5432/node_dev'
};
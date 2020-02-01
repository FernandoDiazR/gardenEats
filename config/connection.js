module.exports = {
    secret: 'SECRETPASSWORDKEY',
    conString: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds125892.mlab.com:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};
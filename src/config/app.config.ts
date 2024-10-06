export const envConfig = () => ({
    environment : process.env.NODE_ENV || 'dev',
    mongoDB : process.env.MONGODB,
    port: process.env.PORT || 3002,
    default_limit : process.env.DEFAULT_LIMIT || 10,
});
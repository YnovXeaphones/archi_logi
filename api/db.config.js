export default {
    host: process.env.HOST || "localhost",
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "test",
    port: process.env.DB_PORT || 3306
}
    
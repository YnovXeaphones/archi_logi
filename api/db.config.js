export default {
    host: process.env.HOST || "localhost",
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'toor',
    database: process.env.DB_DATABASE || "server",
    port: process.env.DB_PORT || 3306
}
    
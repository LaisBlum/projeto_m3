import mysql2 from "mysql2";

const connection = mysql2.createConnection({
    host: 'localhost',
    database: 'guerreiros_da_paz',
    user: 'root',
    password: '---'
});

export default connection;
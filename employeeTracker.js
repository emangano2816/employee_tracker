//require nmp packages for use
const mysql = require('mysql');
const inquirer = require('inquirer');

//create connection info for sql db
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user:'root',
    password: 'P3@nut_t0A$T',
    database: 'employee_trackerDB'
});


//connect to the mysql server and sql db
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
})
//require nmp packages for use
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

//create connection info for sql db
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user:'root',
    password: 'P3@nut_t0A$T',
    database: 'employee_trackerDB'
});

//function to determine which action user would like to take
const start = () => {
    inquirer   
        .prompt({
                    name: 'action',
                    type: 'list',
                    message: 'Would you like [VIEW], [ADD TO], or [UPDATE] the employee roster?',
                    choices: ['VIEW', 'ADD TO', 'UPDATE'],
        })
        .then ((answer) => {
            //based on selection call correct function
            if (answer.action ==='VIEW') {
                viewRoster();
            } else {
                connection.end();
            }
        })
}

const viewRoster = () => {
    connection.query('SELECT dept.name AS "Department Name", erole.title as "Employee Title", emp.first_name AS "Employee First Name", emp.last_name AS "Employee Last Name", CONCAT("$",FORMAT(erole.salary, 2)) as "Salary", emp.manager_id, concat(man.first_name," ",man.last_name) AS "Manager" FROM emprole erole JOIN department dept ON dept.id = erole.department_id LEFT JOIN employee emp ON erole.id = emp.role_id LEFT JOIN employee man ON emp.manager_id = man.id;', (err, results) => {
        if (err) throw err;
        console.table(results);
    })
    connection.end();
}


//connect to the mysql server and sql db
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
})
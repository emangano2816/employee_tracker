//require nmp packages for use
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Department = require('./lib/Department')

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
    console.log('\n\n');

    inquirer   
        .prompt([
                    {
                        type: 'list',        
                        name: 'action',
                        message: 'What would you like to do to the employee roster?',
                        choices: ['VIEW', 'ADD TO', 'UPDATE', 'EXIT Application'],
                    },
                    {
                        type: 'list',
                        name: 'viewwhat',
                        message: 'What information would you like to view?',
                        choices: ['Summary', 'Departments', 'Roles', 'Employees'],
                        when: (answers)=> answers.action === 'VIEW',
                    },
                    {
                        type: 'list',
                        name: 'addwhat',
                        message: 'What would you like to add?',
                        choices: ['Department', 'Role', 'Employee'],
                        when: (answers) => answers.action === 'ADD TO',
                    },
                    {
                        type: 'input',
                        name: 'deptName',
                        message: 'What is the new Department?',
                        when: (answers) => answers.addwhat === 'Department',
                    }

        ])
        .then ((answers) => {
            //based on selection call correct function
            if (answers.viewwhat ==='Summary') {
                viewRoster();
            } else if (answers.viewwhat === 'Departments') {
                viewDepartments();
            } else if (answers.viewwhat === 'Roles') {
                viewRoles();
            } else if (answers.viewwhat === 'Employees') {
                viewEmployees();
            } else if (answers.addwhat === 'Department') {
                addDepartment(answers.deptName);
            } 
            
            else {
                connection.end();
            }
        })
}

//Display employee summary from DB
const viewRoster = () => {
    connection.query('SELECT dept.name AS "Department Name", erole.title as "Employee Title", emp.first_name AS "Employee First Name", emp.last_name AS "Employee Last Name", CONCAT("$",FORMAT(erole.salary, 2)) as "Salary", emp.manager_id, concat(man.first_name," ",man.last_name) AS "Manager" FROM emprole erole JOIN department dept ON dept.id = erole.department_id LEFT JOIN employee emp ON erole.id = emp.role_id LEFT JOIN employee man ON emp.manager_id = man.id;', (err, results) => {
        if (err) throw err;
        console.log('\n------------------------------\nEmployee Summary\n------------------------------\n');
        console.table(results);
        start();
    })
}

//Display departments from DB
const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.log('\n------------------------------\nDepartments\n------------------------------\n');
        console.table(results);
        start();  
    })  
 
}

//Display roles from DB
const viewRoles = () => {
    connection.query('SELECT * FROM emprole', (err, results) => {
        if (err) throw err;
        console.log('\n------------------------------\nEmployee Roles\n------------------------------\n')
        console.table(results);
        start();
    })
}

//Display employees from DB
const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        console.log('\n------------------------------\nEmployees\n------------------------------\n')
        console.table(results);
        start();
    })
}

//Function to add a department
const addDepartment =(deptName) => {
    connection.query('INSERT INTO department SET ?',
        {name: deptName},
        (err) => {
            if(err) throw err;
            console.log('\nDepartment has been added.')
            start();
        })
}

//connect to the mysql server and sql db
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
})
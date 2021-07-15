//require nmp packages for use
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { allowedNodeEnvironmentFlags } = require('process');


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
                        message: 'What would you like to do with the Employee Tracker?',
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
                    },
                    {
                        type: 'input',
                        name: 'roleTitle',
                        message: 'What is the position title?',
                        when: (answers) => answers.addwhat === 'Role',
                    }, 
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary for this position?',
                        when:  (answers) => answers.addwhat === 'Role',
                    },
                    {
                        type: 'input',
                        name: 'fname',
                        message: "What is the employee's first name?",
                        when: (answers) => answers.addwhat === 'Employee',
                    },
                    {
                        type: 'input',
                        name: 'lname',
                        message: "What is the employee's last name?",
                        when: (answers) => answers.addwhat === 'Employee',
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
            } else if (answers.addwhat === 'Role') {
                addRole(answers);
            } else if (answers.addwhat === 'Employee') {
                addEmployee(answers);
            } else if (answers.action === 'UPDATE') {
                updateEmployee();
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

//Function to add a role
const addRole = (titlesalary) => {
    connection.query('SELECT * FROM department', async (err, results) => {
        if (err) throw err;
        //prompt user for which department to add
        const answer = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'deptID',
                choices: returnDeptArray(results),
                message: 'Which department does this role belong to?',
            },
        ]); 
        //find index of selected department in order to find id of department
        deptIndex = results.findIndex(result => result.name === answer.deptID);

        connection.query('INSERT INTO emprole SET ?',
            {
                title: titlesalary.roleTitle,
                salary: titlesalary.salary,
                department_id: results[deptIndex].id,
            }, (error) => {
                if (error) throw err;
                console.log('Role added successfully.')
                start();
            }
        )
    })
}

//Function to add an employee
const addEmployee = (fname_lname) => {
    connection.query('SELECT * FROM department', async (err, results_dept) => {
        if (err) throw err;
        //prompt user for department employee is being added to
        const dept = await inquirer.prompt([
            {
                type:'rawlist',
                name: 'dept',
                choices: returnDeptArray(results_dept),
                message: 'Which department is the employee being added to?',
            },
        ]);
        //find index of selected department in order to find id of department for WHERE clause
        deptIndex = results_dept.findIndex(result => result.name === dept.dept);
        
        connection.query(`SELECT * FROM emprole WHERE department_id = ${results_dept[deptIndex].id}`, async (err, results_role) => {
            const roleID = await inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'roleID',
                    choices: getRoleArray(results_role),
                    message: 'What is the new employees role?',
                },
            ]);
            //find index of selected role in order to supply role id for insert
            roleIndex = results_role.findIndex(result => result.title === roleID.roleID);

            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: fname_lname.fname,
                    last_name: fname_lname.lname,
                    role_id: results_role[roleIndex].id,
                }, (error) => {
                    if (error) throw err;
                    console.log('Employee added successfully.')
                    start();
                }
            )
        })

    })
}

//Function to update employee role
const updateEmployee = () => {
    connection.query("SELECT e.id, concat(e.first_name, ' ', e.last_name) AS empName, e.role_id, e.manager_id, r.title, r.department_id FROM employee e JOIN emprole r ON e.role_id = r.id;", async (err, results_emp) => {
        // console.log(results_emp);
        if (err) throw err;
        //prompt user for the name of the employee they wish to update
        const empUpdate = await inquirer.prompt([
            {
                type:'rawlist',
                name: 'emp',
                choices: getEmpArray(results_emp),
                message: 'Which employee would you like to update?',
            },
        ]);
        //find employee index in order to use role_id in WHERE clause for emprole table
        empIndex = results_emp.findIndex(result => result.empName === empUpdate.emp);

        connection.query(`SELECT * FROM emprole WHERE id <> ${results_emp[empIndex].role_id} AND department_id = ${results_emp[empIndex].department_id}`, async (err, results_role) => {
            console.log(results_role);
            const roleID = await inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'roleID',
                    choices: getRoleArray(results_role),
                    message: 'What is the new employees role?',
                },
            ]);
            //find index of selected role in order to supply role id for insert
            roleIndex = results_role.findIndex(result => result.title === roleID.roleID);

            connection.query(`UPDATE employee SET ? WHERE id = ${results_emp[empIndex].id}`,
                {
                    role_id: results_role[roleIndex].id,
                }, (error) => {
                    if (error) throw err;
                    console.log('Employee role updated successfully.')
                    start();
                }
            )
        })
    })
}

//function to return an array of choices from the deparment table
function returnDeptArray(results) {
    const deptArray = [];
    results.forEach(({ name }) => {
        deptArray.push(name);
    });
    return deptArray;
};

//function to return an array of choices from the emprole table
function getRoleArray(results){
    const roleArray = [];
    results.forEach(({ title }) => {
        roleArray.push(title);
    });
    return roleArray;
}

//function to return an array of employees from employee table
function getEmpArray(results){
    const empArray= [];
    results.forEach(({ empName }) => {
        empArray.push(empName);
    });
    return empArray;
}

//connect to the mysql server and sql db
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
})
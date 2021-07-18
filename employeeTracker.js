//require nmp packages for use
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

//create connection info for sql db
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
                        choices: ['VIEW', 'ADD TO', 'UPDATE', 'REMOVE FROM', 'EXIT Application'],
                    },
                    {
                        type: 'list',
                        name: 'viewwhat',
                        message: 'What information would you like to view?',
                        choices: ['Summary', 'Departments', 'Roles', 'Employees', 'Employees by Manager', 'Budget by Department'],
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
                    },
                    {
                        type: 'list',
                        name: 'updateWhat',
                        choices: ['Employee Role', 'Employee Manager'],
                        message: 'What would you like to update?',
                        when: (answers) => answers.action === "UPDATE",
                    },
                    {
                        type: 'list',
                        name: 'removeWhat',
                        message: 'What would you like to remove?',
                        choices: ['Employee'],
                        when: (answers) => answers.action ==="REMOVE FROM",
                    },

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
            } else if (answers.viewwhat === 'Employees by Manager') {
                viewEmpByManager();
            } else if (answers.viewwhat === 'Budget by Department') {
                viewBudgetByDept();
            } else if (answers.addwhat === 'Department') {
                addDepartment(answers.deptName);
            } else if (answers.addwhat === 'Role') {
                addRole(answers);
            } else if (answers.addwhat === 'Employee') {
                addEmployee(answers);
            } else if (answers.updateWhat === 'Employee Role') {
                updateEmployeeRole();
            } else if (answers.updateWhat === 'Employee Manager') {
                updateEmployeeManager();
            } else if (answers.removeWhat === 'Employee') {
                removeEmployee();
            } else {
                connection.end();
            }
        }) 
}

//Display employee summary from DB
const viewRoster = () => {
    connection.query("SELECT * FROM summary_display_vw",
        (err, results) => {
            if (err) throw err;
            console.log('\n----------------------------------------------------\nSummary of Open and Filled Positions by Department\n----------------------------------------------------\n');
            console.table(results);
            start();
        }
    )
}

//Display departments from DB
const viewDepartments = () => {
    connection.query("SELECT id, name as 'Department' FROM department",
        (err, results) => {
            if (err) throw err;
            console.log('\n------------------------------\nDepartments\n------------------------------\n');
            console.table(results);
            start();  
        }
    )   
}

//Display roles from DB
const viewRoles = () => {
    connection.query("SELECT DISTINCT role_id as id, title as 'Position', salary as 'Salary', name as 'Department' FROM emp_role_dep_vw", 
        (err, results) => {
            if (err) throw err;
            console.log('\n------------------------------\nEmployee Roles\n------------------------------\n')
            console.table(results);
            start();
        }
    )
}

//Display employees from DB
const viewEmployees = () => {
    connection.query("SELECT * FROM employee_details_vw", 
        (err, results) => {
            if (err) throw err;
            console.log('\n------------------------------\nEmployees\n------------------------------\n')
            console.table(results);
            start();
        }
    )
}

//Display employees by Manager
const viewEmpByManager = () => {
    connection.query("SELECT * FROM emp_by_manager_vw",
        (error, results) => {
            if (error) throw error;
            console.log('\n------------------------------\nEmployees by Manager\n------------------------------\n');
            console.table(results);
            start();
        }
    )
}

//Display budget by departments
const viewBudgetByDept = () => {
    connection.query("SELECT * FROM budget_by_dept_vw",
        (error, results) => {
            if (error) throw error;
            console.log('\n------------------------------\nBudget by Department\n------------------------------\n');
            console.table(results);
            start();
        }  
    )
}

//Function to add a department
const addDepartment =(deptName) => {
    connection.query('INSERT INTO department SET ?',
        {name: deptName},
        (err) => {
            if(err) throw err;
            console.log('\nDepartment has been added.')
            start();
        }
    )
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
                choices: getDeptArray(results),
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
                choices: getDeptArray(results_dept),
                message: 'Which department is the employee being added to?',
            },
        ]);
        //find index of selected department in order to find id of department for WHERE clause
        deptIndex = results_dept.findIndex(result => result.name === dept.dept);
        
        connection.query("SELECT * FROM emprole WHERE ?",
            {
                department_id: results_dept[deptIndex].id
            }, 
            async (err, results_role) => {
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
const updateEmployeeRole = () => {
    connection.query("SELECT * FROM emp_role_dept_list_vw;", async (err, results_emp) => {
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

        connection.query("SELECT * FROM emprole WHERE id <> ? AND department_id = ?",
            [results_emp[empIndex].role_id, results_emp[empIndex].department_id],  async (err, results_role) => {
            const roleID = await inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'roleID',
                    choices: getRoleArray(results_role),
                    message: "What is the new employee's role?",
                },
            ]);
            //find index of selected role in order to supply role id for insert
            roleIndex = results_role.findIndex(result => result.title === roleID.roleID);

            connection.query("UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: results_role[roleIndex].id,
                    },
                    {
                        id:results_emp[empIndex].id
                    }
                ], (error) => {
                    if (error) throw err;
                    console.log('Employee role updated successfully.')
                    start();
                }
            )
        })
    })
}

//Function to update Employee Manager
const updateEmployeeManager = () => {
    connection.query("SELECT * FROM emp_role_dept_list_vw;", async (err, results_emp) => {
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
    
        //provide list of possible managers for selected employee, based on department of employee
        connection.query("SELECT * FROM emp_role_dept_list_vw WHERE id <> ? AND department_id = ?",
            [results_emp[empIndex].id, results_emp[empIndex].department_id],
            async (err, results_man) => {
            // console.log(results_emp);
            if (err) throw err;

            //prompt user for the name of the employee they wish to update
            const manUpdate = await inquirer.prompt([
                {
                    type:'rawlist',
                    name: 'manager',
                    choices: getEmpArray(results_man),
                    message: 'Which employee would you like to update?',
                },
            ]);
            //find employee index in order to use role_id in WHERE clause for emprole table
            manIndex = results_man.findIndex(result => result.empName === manUpdate.manager);

            connection.query("UPDATE employee SET ? WHERE ?",
                [
                    {
                        manager_id: results_man[manIndex].id,
                    },
                    {
                        id:results_emp[empIndex].id
                    }
                ], 
                (error) => {
                    if (error) throw error;
                    console.log("Employee's Manager updated successfully.")
                    start();
                }
            )
        })
    })    
}


//Function to remove Employees from the employe DB table
const removeEmployee = () => {
    connection.query("SELECT id, concat(first_name, ' ', last_name) AS empName FROM employee", async (err, results_emp) => {
        if (err) throw err;
        //prompt user for the name of the employee they wish to update
        const empRemove = await inquirer.prompt([
            {
                type:'rawlist',
                name: 'emp',
                choices: getEmpArray(results_emp),
                message: 'Which employee would you like to update?',
            },
        ]);
        //find employee index in order to use role_id in WHERE clause for emprole table
        empIndex = results_emp.findIndex(result => result.empName === empRemove.emp);

        connection.query("DELETE FROM employee WHERE ?", 
            {
                id: results_emp[empIndex].id
            }, 
            (error) => {
            if (error) throw error;
            console.log('Employee removed successfully.');
            start();
        });
    })
}

//function to return an array of choices from the deparment table
function getDeptArray(results) {
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
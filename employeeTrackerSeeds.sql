DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- Create department table --
-- Parent table to emprole--
CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

-- Create role table --
-- Child table of department--
-- Parent table of employee --
CREATE TABLE emprole (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_department_id FOREIGN KEY (department_id) 
    REFERENCES department(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- Create employee table --
-- Child table of emprole
CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NULL,
    manager_id INTEGER NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_role_id FOREIGN KEY (role_id) 
    REFERENCES emprole(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    CONSTRAINT FK_manager_id FOREIGN KEY (manager_id)
    REFERENCES emprole(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- Insert test data into tables --
INSERT INTO department (name) 
VALUES('Accountability'), ('Testing');

INSERT INTO emprole (title, salary, department_id) 
VALUES ('Program Manager', '100000', 1),('Data Specialist I', '65000', 1), ('Data Specialist II', '75000', 1), ('Research Specialist I', '75000', 1), ('Research Specialist II', 85000, 1);

INSERT INTO emprole (title, salary, department_id) 
VALUES ('Research Specialist', '100000', 2), ('Testing Specialist I', '85000',2), ('Testing Specialist II', '95000',2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Beth', 'Smith', 1, null), ('Elsa', 'Arendale', 2, 1), ('Poppy', 'Troll', 3, 1), ('Belle','Beast', 4, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tinker', 'Bell', 6, null), ('Peter', 'Pan', 7, null), ('Sven', 'Reigndeer', '7','5'), ('Captian', 'Hook', '7', null);


-- Create Views --
-- View for Summary Display
CREATE VIEW summary_display_vw AS
 SELECT dept.name AS 'Department Name', erole.title as 'Position', CONCAT('$',FORMAT(erole.salary, 2)) as 'Salary', concat(man.first_name,' ',man.last_name) AS 'Employee Manager', emp.first_name AS 'Employee First Name', emp.last_name AS 'Employee Last Name' 
 FROM emprole erole 
 RIGHT JOIN department dept ON dept.id = erole.department_id 
 LEFT JOIN employee emp ON erole.id = emp.role_id 
 LEFT JOIN employee man ON emp.manager_id = man.id;

-- Employee List with Role and Department View
CREATE VIEW emp_role_dept_list_vw AS
SELECT e.id, concat(e.first_name, ' ', e.last_name) AS empName, e.role_id, e.manager_id, r.title, r.department_id 
FROM employee e 
JOIN emprole r ON e.role_id = r.id;

-- Employee Detail View
CREATE VIEW employee_details_vw AS
SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, r.title AS Position, CONCAT('$', FORMAT(r.salary,2)) AS Salary, CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager'
FROM employee e
LEFT JOIN employee e2 on e.manager_id = e2.id
LEFT JOIN emprole r on e.role_id = r.id
ORDER BY employee;

-- View of Employee by Manager
CREATE VIEW emp_by_manager_vw AS
SELECT d.name as 'Department', a.first_name as 'Manager First Name', a.last_name as 'Manager Last Name', r.title as 'Employee Position', b.first_name as 'Employee First Name', b.last_name as 'Employee Last Name' 
FROM employee a 
RIGHT JOIN employee b on a.id = b.manager_id 
JOIN emprole r on r.id = b.role_id 
RIGHT JOIN department d on r.department_id = d.id 
ORDER BY d.name, a.last_name desc, a.first_name, b.last_name, b.first_name;

-- View of all tables joined together --
-- Used to generate budget_by_dept_vw --
CREATE VIEW emp_role_dep_vw AS
SELECT r.id as role_id, r.title, r.salary, a.id as emp_id, a.first_name, a.last_name, a.role_id as emp_role_id, a.manager_id, d.id as dept_id, d.name
FROM emprole r
LEFT JOIN employee a ON r.id = a.role_id
RIGHT JOIN department d ON d.id = r.department_id;

-- View of budget summary by department --
CREATE VIEW budget_by_dept_vw AS
SELECT CONCAT('$',FORMAT(z.utilized_budget,2)) as 'Utilized Budget', CONCAT('$', FORMAT(y.unutilized_budget, 2)) as 'Un-utilized Budget', CONCAT('$', FORMAT(x.total_budget,2)) as 'Total Budget', x.name as 'Department'
FROM 
((SELECT sum(salary) as utilized_budget, name
FROM emp_role_dep_vw
WHERE emp_id is not null
GROUP BY dept_id) as z
LEFT JOIN (SELECT sum(salary) as unutilized_budget, name
FROM emp_role_dep_vw
WHERE emp_id is null
GROUP BY dept_id) as y
ON z.name = y.name
RIGHT JOIN (select sum(salary) as total_budget, name
FROM emp_role_dep_vw
GROUP BY dept_id) as x
ON z.name = x.name)
GROUP BY x.name;
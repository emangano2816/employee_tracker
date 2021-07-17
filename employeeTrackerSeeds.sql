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
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_department_id FOREIGN KEY (department_id) 
    REFERENCES department(id)
);

-- Create employee table --
-- Child table of emprole
CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_role_id FOREIGN KEY (role_id) 
    REFERENCES emprole(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT FK_manager_id FOREIGN KEY (manager_id)
    REFERENCES emprole(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

--Insert test data into tables
INSERT INTO department (name) 
VALUES('Accountability'), ('Testing');

INSERT INTO emprole (title, salary, department_id) 
VALUES ('Program Manager', '100000', 1),('Data Specialist I', '65000', 1), ('Data Specialist II', '75000', 1), ('Research Specialist I', '75000', 1), ('Research Specialist II', 85000, 1);

INSERT INTO emprole (title, salary, department_id) 
VALUES ('Manager', '100000', 2), ('Testing Specialist I', '85000',2), ('Testing Specialist ', '95000',2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Beth', 'Smith', 1, null), ('Elsa', 'Arendale', 2, 1), ('Poppy', 'Troll', 3, 1), ('Belle','Beast', 3, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Karen', 'Book', 6, null), ('Peter', 'Pan', 7, null), ('Sven', 'Reigndeer', '8','5')


-- Create view of all tables joined together
CREATE VIEW emp_role_dep_vw AS
SELECT r.id as role_id, r.title, r.salary, a.id as emp_id, a.first_name, a.last_name, a.role_id as emp_role_id, a.manager_id, d.id as dept_id, d.name
FROM emprole r
LEFT JOIN employee a ON r.id = a.role_id
LEFT JOIN department d ON d.id = r.department_id;

-- Create view of budget by department
CREATE VIEW budget_by_dept_vw AS
SELECT z.utilized_budget, y.unutilized_budget, x.total_budget, z.name
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
LEFT JOIN (select sum(salary) as total_budget, name
FROM emp_role_dep_vw
GROUP BY dept_id) as x
ON z.name = x.name)
GROUP BY z.name
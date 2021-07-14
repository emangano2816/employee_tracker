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

-- Populating tables with test data --
INSERT INTO department (name) 
VALUES('Accountability'), ('Testing'), ('Research');

INSERT INTO emprole (title, salary, department_id) 
VALUES ('Manager', '100000', 1), ('Data Specialist', '80000', 1);

INSERT INTO emprole (title, salary, department_id) 
VALUES ('Manager', '100000', 2), ('Testing Specialist', '85000',2);

INSERT INTO emprole (title, salary, department_id)
VALUES ('Research Specialist','90000',3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Beth', 'Thompson', 1, null), ('Clark', 'Account', 2, 1);
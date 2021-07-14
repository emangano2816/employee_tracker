DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- Create department table --
CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

-- Create role table --
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
CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_role_id FOREIGN KEY (role_id) 
    REFERENCES emprole(id),
    CONSTRAINT FK_manager_id FOREIGN KEY (manager_id)
    REFERENCES emprole(id)
);
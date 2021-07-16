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
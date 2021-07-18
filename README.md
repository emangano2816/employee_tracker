# Employee Tracker

![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Link(s)

[GitHub Repository](https://github.com/emangano2816/employee_tracker)

## User Story

```text
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

## Summary of Application Functionality

The Employee Tracker application uses mySQL Workbench to store information about employees within a company.  The employeeTrackerSeeds.sql file provides the mySQL code needed to seed the database prior to running the application.  

To start the application type node employeeTracker.js into the command line.  This will prompt the system to ask the user what they would like to do with the Employee Tracker.  Options include VIEW, ADD TO, REMOVE FROM, and EXIT Application.

Upon selecting 'VIEW' the user is asked what they would like to view.  Options include: 
   * Summary: provides a summary of open and filled positions by department
   * Departments: provides a list of departments by id
   * Roles: provides a list of roles by id and department
   * Employees: provides a list of employees by id
   * Employees by Manager: provides a list of employees by department and employee manager
   * Budget by Department: provides the Total Budget, Utilized Budget, and Un-utilized Budget by department

Upon selecting 'ADD TO' the user is asked what they would like to add.  Options include:
   * Department
   * Role
   * Employee

Upon selecting 'UPDATE' the user is asked what they would like to update. Options include:
   * Employee Role
   * Employee Manager

Upon selecting 'REMOVE FROM' the user asked what they would like to remove.  Options include:
   * Employee

Finally, upon selecting 'EXIT Application' the user is exited from the application.
   
## Tecnhologies Used

1. Node.js
2. npm (inquirer, mysql, console.table)
4. JavaScript

## Installation

You will need node.js, the inquirer package, mysql package, and console.table package.

## Video Demonstration

https://user-images.githubusercontent.com/79860046/126083089-00890127-cfdd-46da-b42f-09a3c9d8bc2d.mp4

## License

This application is covered under the MIT license.

# ToDo
A simple and efficient task management app. Add, edit, and delete tasks with ease. 

This repository contains a lightweight and efficient TodoList application coded with simplicity in mind. It helps you keep track of your tasks and stay organized. With this code, you'll have a basic yet functional task management system at your disposal.

Key features of the TodoList application include:

Task creation: Easily add new tasks to your list.
Task editing: Modify task details whenever necessary.
Task deletion: Remove completed or unnecessary tasks.
Task completion: Mark tasks as done when finished.
User-friendly interface: Enjoy a straightforward interface for a hassle-free experience.


Test Data:

Registered User:
Name: Zanele
Email: zanelechigweshe@gmail.com
Password: masiyephambili
Test Cases:
a. User Registration:

Enter valid user details (name, email, password) and submit the registration form.
Verify that the user is redirected to the login page.
Try registering with an already registered email address.
Verify that appropriate error message is displayed.
b. User Login:

Enter valid login credentials and submit the login form.
Verify that the user is redirected to the home page ("/") and their name is displayed.
Try logging in with incorrect email/password.
Verify that appropriate error message is displayed.
c. Todo List Functionality:

After successful login, verify that the todo list is displayed with no todos initially.
Add a new todo with a valid description and check if it is displayed in the list.
Add a new todo with an empty description and verify that appropriate error message is displayed.
Add a duplicate todo and verify that appropriate error message is displayed.
Edit an existing todo and check if the changes are reflected in the list.
Mark a todo as complete/incomplete and verify that its status is updated accordingly.
Delete a todo and verify that it is removed from the list.
d. Authentication and Authorization:

Access the home page ("/") without logging in and verify that you are redirected to the login page.
Access the login page ("/login") when already logged in and verify that you are redirected to the home page.
Try accessing the registration page ("/register") when already logged in and verify that you are redirected to the home page.
Try accessing the home page ("/") after logging out and verify that you are redirected to the login page.

Installation instructions
1. Clone the Repository:
  git clone <repository-https://github.com/zahhhhhh/ToDo.git
![image](https://github.com/zahhhhhh/ToDo/assets/79584184/be80f831-66a7-4386-924e-4e57303cfe11)
>
2. Install Dependencies:
   cd <project-directory>
    npm install
3. Set Up the Database:
  Make sure you have SQLite installed on your system.
  Create a new SQLite database file named todolist.db.
  You can use a SQLite client like "DB Browser for SQLite" or run SQLite commands to create the necessary table. Use the following command to create the tasks table:
  CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  status TEXT NOT NULL
);
  
Run instructions:
1. Start the Server:
   node server.js
2.Access the Web Application:
Open your web browser and go to http://localhost:3001/  to access the home page.
You can now register, login, and manage your todo list through the web application.

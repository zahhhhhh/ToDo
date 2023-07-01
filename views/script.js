// SELECT ELEMENTS
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
const notificationEl = document.querySelector(".notification");
const sqlite3 = require("sqlite3").verbose();

//sqlite database
const db = new sqlite3.Database("./todolist.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// 1st render
renderTodos();

// FORM SUBMIT
form.addEventListener("submit", function (event) {
  event.preventDefault();

  saveTodo();
  renderTodos();
});

// SAVE TODO
function saveTodo() {
  const todoValue = todoInput.value;

  // check if the todo is empty
  const isEmpty = todoValue === "";

  // check for duplicate todos
  const isDuplicateQuery =
    "SELECT COUNT(*) AS count FROM tasks WHERE description = ?";
  db.get(isDuplicateQuery, [todoValue], (err, row) => {
    if (err) {
      showNotification("An error occurred");
    } else {
      const isDuplicate = row.count > 0;

      if (isEmpty) {
        showNotification("Todo's input is empty");
      } else if (isDuplicate) {
        showNotification("Todo already exists!");
      } else {
        const insertQuery =
          "INSERT INTO tasks (description, status) VALUES (?, ?)";
        const status = "incomplete";

        db.run(insertQuery, [todoValue, status], (err) => {
          if (err) {
            showNotification("An error occurred");
          } else {
            todoInput.value = "";
            showNotification("Todo added successfully");
            renderTodos();
          }
        });
      }
    }
  });
}

// RENDER TODOS
function renderTodos() {
  const selectQuery = "SELECT * FROM tasks ORDER BY id ASC";
  db.all(selectQuery, (err, rows) => {
    if (err) {
      showNotification("An error occurred");
    } else {
      if (rows.length === 0) {
        todosListEl.innerHTML = "<center>Nothing to do!</center>";
      } else {
        todosListEl.innerHTML = rows
          .map(
            (row) => `
        <div class="todo" id=${row.id}>
          <i class="bi ${
            row.status === "complete" ? "bi-check-circle-fill" : "bi-circle"
          }" style="color: ${row.color}" data-action="check"></i>
          <p class="${
            row.status === "complete" ? "checked" : ""
          }" data-action="check">${row.description}</p>
          <i class="bi bi-pencil-square" data-action="edit"></i>
          <i class="bi bi-trash" data-action="delete"></i>
        </div>
        `
          )
          .join("");
      }
    }
  });
}

// CLICK EVENT LISTENER FOR ALL THE TODOS
todosListEl.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;

  // t o d o id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // target action
  const action = target.dataset.action;

  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);
});

// CHECK A TODO
function checkTodo(todoId) {
  const updateQuery = `UPDATE tasks SET status = CASE WHEN status = 'complete' THEN 'incomplete' ELSE 'complete' END WHERE id = ?`;
  db.run(updateQuery, [todoId], (err) => {
    if (err) {
      showNotification("An error occurred");
    } else {
      renderTodos();
      showNotification("Todo updated successfully");
    }
  });
}

// EDIT A TODO
function editTodo(todoId) {
  const selectQuery = `SELECT description FROM tasks WHERE id = ?`;
  db.get(selectQuery, [todoId], (err, row) => {
    if (err) {
      showNotification("An error occurred");
    } else {
      if (row) {
        todoInput.value = row.description;
      }
    }
  });
}

// DELETE TODO
function deleteTodo(todoId) {
  const deleteQuery = `DELETE FROM tasks WHERE id = ?`;
  db.run(deleteQuery, [todoId], (err) => {
    if (err) {
      showNotification("An error occurred");
    } else {
      renderTodos();
      showNotification("Todo deleted successfully");
    }
  });
}

// SHOW A NOTIFICATION
function showNotification(msg) {
  // change the message
  notificationEl.innerHTML = msg;

  // notification enter
  notificationEl.classList.add("notif-enter");

  // notification leave
  setTimeout(() => {
    notificationEl.classList.remove("notif-enter");
  }, 2000);
}

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Importing Libraries that we installed using npm
const express = require("express");
const app = express();
const bcrypt = require("bcrypt"); // Importing bcrypt package
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const sqlite3 = require("sqlite3").verbose();

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: "sadkasodkaodo",
    resave: false, // We won't resave the session variable if nothing is changed
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// SQLite database
const db = new sqlite3.Database("./todolist.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Configuring the register post functionality
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Configuring the register post functionality
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log(users); // Display newly registered users in the console
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/register");
  }
});

// Routes
app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.delete("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// Todo list functionality

// Display the todo list
app.get("/todos", checkAuthenticated, (req, res) => {
  const selectQuery = "SELECT * FROM tasks WHERE user_id = ? ORDER BY id ASC";
  db.all(selectQuery, [req.user.id], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else {
      res.render("index.ejs", { todos: rows });
    }
  });
});

// Add a new todo
app.post("/todos", checkAuthenticated, (req, res) => {
  const todoValue = req.body.todo;

  // Check if the todo is empty
  const isEmpty = todoValue === "";

  // Check for duplicate todos
  const isDuplicateQuery =
    "SELECT COUNT(*) AS count FROM tasks WHERE description = ? AND user_id = ?";
  db.get(isDuplicateQuery, [todoValue, req.user.id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else {
      const isDuplicate = row.count > 0;

      if (isEmpty) {
        req.flash("error", "Todo's input is empty");
        res.redirect("/todos");
      } else if (isDuplicate) {
        req.flash("error", "Todo already exists!");
        res.redirect("/todos");
      } else {
        const insertQuery =
          "INSERT INTO tasks (description, status, user_id) VALUES (?, ?, ?)";
        const status = "incomplete";

        db.run(insertQuery, [todoValue, status, req.user.id], (err) => {
          if (err) {
            console.error(err.message);
            res.sendStatus(500);
          } else {
            req.flash("success", "Todo added successfully");
            res.redirect("/todos");
          }
        });
      }
    }
  });
});

// Delete a todo
app.delete("/todos/:id", checkAuthenticated, (req, res) => {
  const deleteQuery = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
  db.run(deleteQuery, [req.params.id, req.user.id], (err) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else {
      req.flash("success", "Todo deleted successfully");
      res.sendStatus(200);
    }
  });
});

// Update the status of a todo
app.put("/todos/:id", checkAuthenticated, (req, res) => {
  const updateQuery =
    "UPDATE tasks SET status = CASE WHEN status = 'complete' THEN 'incomplete' ELSE 'complete' END WHERE id = ? AND user_id = ?";
  db.run(updateQuery, [req.params.id, req.user.id], (err) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else {
      req.flash("success", "Todo updated successfully");
      res.sendStatus(200);
    }
  });
});

// End of Todo list functionality

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3001, () => {
  console.log("Server started on port 3001");
});

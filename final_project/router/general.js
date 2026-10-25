const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({status: 404, message: "Book not found"});
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(err.status || 500).json({message: err.message}));
});

// Task 12: Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const matchingBooks = Object.values(books).filter(
      (b) => b.author.toLowerCase() === author.toLowerCase()
    );
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({message: "No books found by this author"});
    }
  } catch (err) {
    return res.status(500).json({message: "Error retrieving books by author"});
  }
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const matchingBooks = Object.values(books).filter(
      (b) => b.title.toLowerCase() === title.toLowerCase()
    );
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({status: 404, message: "No books found with this title"});
    }
  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(err.status || 500).json({message: err.message}));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;

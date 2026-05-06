const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); 

// Task 1: Get the book list available in the shop (Updated with Async/Await - Task 10)
public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(books);
            });
        };
        const allBooks = await getBooks();
        res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);
    const filtered = keys.filter(key => books[key].author === author).map(key => books[key]);
    
    if (filtered.length > 0) {
        res.status(200).send(JSON.stringify(filtered, null, 4));
    } else {
        res.status(404).json({ message: "Author not found" });
    }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);
    const filtered = keys.filter(key => books[key].title === title).map(key => books[key]);

    if (filtered.length > 0) {
        res.status(200).send(JSON.stringify(filtered, null, 4));
    } else {
        res.status(404).json({ message: "Title not found" });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "No reviews for this ISBN" });
    }
});

module.exports.general = public_users;

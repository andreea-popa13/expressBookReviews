const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => Promise.resolve(books);
        const allBooks = await getBooks();
        res.status(200).send(JSON.stringify({ books: allBooks }, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 11: Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const getBookByISBN = () => {
            return new Promise((resolve, reject) => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject({ status: 404, message: "Book not found" });
                }
            });
        };
        const book = await getBookByISBN();
        res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

// Task 12: Get book details based on Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = () => {
            return new Promise((resolve) => {
                const keys = Object.keys(books);
                const filtered = keys
                    .filter(key => books[key].author === author)
                    .map(key => ({ isbn: key, ...books[key] }));
                resolve(filtered);
            });
        };
        const results = await getBooksByAuthor();
        if (results.length > 0) {
            res.status(200).send(JSON.stringify({ booksByAuthor: results }, null, 4));
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 13: Get all books based on Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = () => {
            return new Promise((resolve) => {
                const keys = Object.keys(books);
                const filtered = keys
                    .filter(key => books[key].title === title)
                    .map(key => ({ isbn: key, ...books[key] }));
                resolve(filtered);
            });
        };
        const results = await getBooksByTitle();
        if (results.length > 0) {
            res.status(200).send(JSON.stringify({ booksByTitle: results }, null, 4));
        } else {
            res.status(404).json({ message: "No books found for this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 5: Get book review (Sincron, conform cerinței inițiale)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 6: Register User
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const exists = users.find(u => u.username === username);
        if (!exists) {
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        }
        return res.status(400).json({ message: "User already exists!" });
    }
    return res.status(400).json({ message: "Username or password missing" });
});

module.exports.general = public_users;

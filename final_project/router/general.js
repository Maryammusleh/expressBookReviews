const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
        return res.status(409).json({ message: "User already exists!" });
    }
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Returns the books database as a Promise
const getBooks = () => {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject(new Error("Books not available"));
        }
    });
};

// Get the book list available in the shop (async/await)
public_users.get("/", async (req, res) => {
    try {
        const allBooks = await getBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN (Promise callbacks)
public_users.get("/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    getBooks()
        .then((allBooks) => {
            if (allBooks[isbn]) {
                return res.status(200).send(JSON.stringify(allBooks[isbn], null, 4));
            }
            return res.status(404).json({ message: "Book with ISBN " + isbn + " not found" });
        })
        .catch(() => res.status(500).json({ message: "Error retrieving book" }));
});// Get book details based on author (async/await)
public_users.get("/author/:author", async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();
        const allBooks = await getBooks();
        const booksByAuthor = Object.keys(allBooks)
            .filter(isbn => allBooks[isbn].author.toLowerCase() === author)
            .map(isbn => ({ isbn: isbn, author: allBooks[isbn].author, title: allBooks[isbn].title, reviews: allBooks[isbn].reviews }));
        if (booksByAuthor.length > 0) {
            return res.status(200).send(JSON.stringify({ booksbyauthor: booksByAuthor }, null, 4));
        }
        return res.status(404).json({ message: "No books found for this author" });
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get all books based on title (async/await)
public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const allBooks = await getBooks();
        const booksByTitle = Object.keys(allBooks)
            .filter(isbn => allBooks[isbn].title.toLowerCase() === title)
            .map(isbn => ({ isbn: isbn, author: allBooks[isbn].author, title: allBooks[isbn].title, reviews: allBooks[isbn].reviews }));
        if (booksByTitle.length > 0) {
            return res.status(200).send(JSON.stringify({ booksbytitle: booksByTitle }, null, 4));
        }
        return res.status(404).json({ message: "No books found with this title" });
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book reviews
public_users.get("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    return res.status(404).json({ message: "Book with ISBN " + isbn + " not found" });
});

// ---------- Axios client functions (async/await and Promise callbacks) ----------

// Get all books using async/await with Axios
const getAllBooksAxios = async () => {
    try {
        const response = await axios.get(BASE_URL + "/");
        return response.data;
    } catch (error) {
        throw new Error("Error fetching all books: " + error.message);
    }
};

// Get book details by ISBN using Promise callbacks with Axios
const getBookByISBNAxios = (isbn) => {
    return axios.get(BASE_URL + "/isbn/" + isbn)
        .then(response => response.data)
        .catch(error => {
            throw new Error("Error fetching book by ISBN: " + error.message);
        });
};

// Get books by author using async/await with Axios
const getBooksByAuthorAxios = async (author) => {
    try {
        const response = await axios.get(BASE_URL + "/author/" + encodeURIComponent(author));
        return response.data;
    } catch (error) {
        throw new Error("Error fetching books by author: " + error.message);
    }
};

// Get books by title using async/await with Axios
const getBooksByTitleAxios = async (title) => {
    try {
        const response = await axios.get(BASE_URL + "/title/" + encodeURIComponent(title));
        return response.data;
    } catch (error) {
        throw new Error("Error fetching books by title: " + error.message);
    }
};

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;

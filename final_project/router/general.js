// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Creăm o Promisiune care caută cartea
    const findBook = new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject({ status: 404, message: "Book not found" });
            }
        }, 500); // Simulează o întârziere de rețea
    });

    // Gestionăm rezultatul Promisiunii
    findBook
        .then((book) => {
            res.status(200).send(JSON.stringify(book, null, 4));
        })
        .catch((error) => {
            res.status(error.status || 500).json({ message: error.message });
        });
});

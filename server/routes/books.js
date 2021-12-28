// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let Book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  Book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    res.render('books/details', {
      title: 'Add a new book',
      books: null
    })

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  const { title, price, author, genre } = req.body;
  let newBook = new Book({
      Title: title,
      Price: price,
      Author: author,
      Genre: genre
  });
  newBook.save().then((bookDoc) => {
      Book.find({}).then((books) =>{
          res.redirect('/books');
      });
  })

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  const id = req.params['id']

  Book.findById(id).then((bookDoc) =>{
      res.render('books/details', {
          title: 'Update a book',
          books: bookDoc
      })
  })
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  const id = req.params['id']
  const { title, price, author, genre } = req.body

  Book.findOneAndUpdate({ _id:id }, {
    Title: title,
      Price: price,
      Author: author,
      Genre: genre
  }).then(() => {
    res.redirect('/books')
});
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  Book.findOneAndRemove({ 
    _id: req.params.id
  }).then((removeBookDoc) => {
  res.redirect('/books')
})
});


module.exports = router;

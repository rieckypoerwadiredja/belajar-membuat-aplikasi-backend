const {
  addBook,
  getAllBook,
  getBookById,
  deleteBook,
  updateBook,
} = require('./handler');

const routes = [
  {
    path: '/books',
    method: 'POST',
    handler: addBook,
  },

  {
    path: '/books',
    method: 'GET',
    handler: getAllBook,
  },

  {
    path: '/books/{bookId}',
    method: 'GET',
    handler: getBookById,
  },

  {
    path: '/books/{bookId}',
    method: 'DELETE',
    handler: deleteBook,
  },

  {
    path: '/books/{bookId}',
    method: 'PUT',
    handler: updateBook,
  },
];

module.exports = routes;

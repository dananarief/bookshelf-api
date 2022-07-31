const {
  addBookHandler,
  showAllBooksHandler,
  getBookDetailHandler,
  updateBookDetailhandler,
  deleteBookHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: showAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookDetailHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookDetailhandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandler,
  },
];
module.exports = routes;

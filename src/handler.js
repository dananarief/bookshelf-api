const { nanoid } = require('nanoid');
const books = require('./books');

function createResponse(hapi, statusContent, statusCode, messageContent, dataContent) {
  const response = hapi.response({
    status: statusContent,
    message: messageContent,
    data: dataContent,
  });
  response.code(statusCode);
  return response;
}

// Create Book

const addBookHandler = (request, hapi) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    return createResponse(hapi, 'fail', 400, 'Gagal menambahkan buku. Mohon isi nama buku');
  }

  if (readPage > pageCount) {
    return createResponse(hapi, 'fail', 400, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
  }

  books.push(newBook);
  return createResponse(hapi, 'success', 201, 'Buku berhasil ditambahkan', { bookId: id });
};

// Get All Books

const showAllBooksHandler = (request, hapi) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;
  if (name) {
    filteredBooks = filteredBooks.filter((book) => {
      const nameLowerCase = name.toLowerCase();
      return book.name.toLowerCase().includes(nameLowerCase);
    });
  }

  if (reading) {
    const readingBoolean = (reading === '1');
    filteredBooks = filteredBooks.filter((book) => book.reading === readingBoolean);
  }

  if (finished) {
    const finishedBoolean = (finished === '1');
    filteredBooks = filteredBooks.filter((book) => book.finished === finishedBoolean);
  }

  const simplifiedBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return createResponse(hapi, 'success', 200, undefined, { books: simplifiedBooks });
};

// Get Book Detail

const getBookDetailHandler = (request, hapi) => {
  const { bookId } = request.params;
  const filteredBook = books.filter((item) => item.id === bookId)[0];

  if (filteredBook !== undefined) {
    return createResponse(hapi, 'success', 200, undefined, { book: filteredBook });
  }

  return createResponse(hapi, 'fail', 404, 'Buku tidak ditemukan', undefined);
};

// Update Book Detail
const updateBookDetailhandler = (request, hapi) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((item) => item.id === bookId);

  const isSuccess = index !== -1;

  if (!name) {
    return createResponse(hapi, 'fail', 400, 'Gagal memperbarui buku. Mohon isi nama buku');
  }

  if (readPage > pageCount) {
    return createResponse(hapi, 'fail', 400, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
  }

  if (isSuccess) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    return createResponse(hapi, 'success', 200, 'Buku berhasil diperbarui', undefined);
  }

  return createResponse(hapi, 'fail', 404, 'Gagal memperbarui buku. Id tidak ditemukan');
};

// Delete Book
const deleteBookHandler = (request, hapi) => {
  const { bookId } = request.params;

  const index = books.findIndex((item) => item.id === bookId);

  const isSuccess = index !== -1;

  if (isSuccess) {
    books.splice(index, 1);
    return createResponse(hapi, 'success', 200, 'Buku berhasil dihapus');
  }

  return createResponse(hapi, 'fail', 404, 'Buku gagal dihapus. Id tidak ditemukan');
};

module.exports = {
  addBookHandler,
  showAllBooksHandler,
  getBookDetailHandler,
  updateBookDetailhandler,
  deleteBookHandler,
};

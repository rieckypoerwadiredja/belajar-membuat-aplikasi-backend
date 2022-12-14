/* eslint-disable max-len */
// ID
const { nanoid } = require('nanoid');
// Notes Database
const books = require('./books');

// todo: Menambahkan buku baru
const addBook = (request, h) => {
  // ? Mengumpulkan data dari user & tambahan
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
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  // eslint (readPage === reading ? true : false)  
  const finished = readPage === reading;
  // ! Data tidak valid
  // ! tidak ada name
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // ! Data hlm dibaca > jml hlm
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  
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
  books.push(newBook);

  // ! tidak ada id yg sama 
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  console.log(`buku ${isSuccess.name} ${isSuccess.id} ditambahkan`);
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    
    response.code(201);
    console.log(newBook);
    console.log(`buku ${name} ${id} telah ditambahkan`);
    return response;
  }

  // ! terjadi kesalahan pada server
  // ! buku yg memiliki id sama tadi dikeluarkan dari DB
  const bookIndex = books.findIndex((book) => book.id === id && book.name === name);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

// todo: Mendapatkan data seluruh buku yang ada
const getAllBook = (request, h) => {
  // ? filter berdasar nilai params (name, id, finished)
  let filterBook = books;
  const { name, finished, reading } = request.query;

  if (name) {
    filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }
  
  if (reading) {
    const readingValue = reading === '1';
    filterBook = books.filter((book) => book.reading.toString() === readingValue.toString());
  }

  if (finished) {
    filterBook = books.filter((book) => Number(book.finished) === Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filterBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// todo: Mendapatkan full data buku secara spesifik
const getBookById = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((buku) => buku.id === bookId);

  // ! kalo ada buku dgn id yang diminta
  if (book.length > 0) {
    console.log(`Mendapatkan buku ${book[0].name}`);
    const response = h.response({
      status: 'success',
      data: {
        book: book[0],
      },
    });
    response.code(200);
    return response;
  }
  // ! bukunya ga ada
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
}; 

// todo: Menghapus buku yang ada (must same Id)
const deleteBook = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = books.findIndex((buku) => buku.id === bookId);
  
  // ! kalo ketemu bukunya -- Hapus
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    console.log(`Menghapus buku ${bookId}`);
    return response;
  }

  // ! bukunya ga ada
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBook = (request, h) => {
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
  const updatedAt = new Date().toISOString();
  const finished = readPage === reading;
  // ! Data tidak valid
  // ! tidak ada name
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // ! Data hlm dibaca > jml hlm
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
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

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBook,
  getAllBook,
  getBookById,
  deleteBook,
  updateBook,
};

 import React from 'react';
import { Link } from 'react-router-dom';
import escapeRegExp from 'escape-string-regexp';
import Book from './Book';

const SearchBook = ({ query, books, updateShelf, updateQuery, clearQuery, status }) => {
  let searchBooks = [];
  if (query) {
    const match = new RegExp(escapeRegExp(query), 'i')
    searchBooks = books.filter((book) => match.test(book.title))
  }
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to='/'>Close</Link>
          <div className="search-books-input-wrapper">
            <input type="text"
              placeholder="Search by title or author"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {searchBooks.map((book) => (
              <Book
              updateShelf={updateShelf}
              key={book.id}
              status={status}
              book={book}
              />
            ))}
          </ol>
        </div>
      </div>
    )
};

export default SearchBook
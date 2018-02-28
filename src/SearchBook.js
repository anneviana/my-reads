 import React from 'react'
import { Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
// import PropTypes from 'prop-types'
import Book from './Book'

const SearchBook = ({ query, books, updateShelf, updateQuery, clearQuery }) => {
  // static propTypes = {
  //   books: PropTypes.array.isRequired,
  //   query: PropTypes.string.isRequired,
  //   onSearch: PropTypes.func,
  //   onUpdateQuery: PropTypes.func,
  //   onUpdateBook: PropTypes.func,
  // }
  updateShelf = (book) => {
    console.log('update')
  }
  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }
  clearQuery = () => {
    this.setState({ query: '' })
  }
  let searchBooks
  if (query) {
    const match = new RegExp(escapeRegExp(query), 'i')
    searchBooks = books.filter((book) => match.test(book.title))
  } else {
    searchBooks = books
  }
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to='/'>Close</Link>
          <div className="search-books-input-wrapper">
            <input type="text"
              placeholder="Search by title or author"
              value={query}
              onChange={(event) => this.updateQuery(event.target.value)}/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {searchBooks.map((book) => (
              <Book
              updateShelf={(e) => this.updateShelf(e)}
              key={book.id}
              book={book}
              />
            ))}
          </ol>
        </div>
      </div>
    )
}

export default SearchBook
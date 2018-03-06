import React from 'react'
import Book from './Book'

const BookShelf = ({ shelfTitle, books, updateShelf, status }) => {
  const currentBookShelf = books.filter(book => book.shelf === status)
  return (
    <div className="bookshelf">
      <div className="bookshelf-books">
        <ol className="books-grid">
        {currentBookShelf.map((book) => (
          <Book
          key={book.id}
          book={book}
          shelfTitle={shelfTitle}
          updateShelf={updateShelf}
          />
        )) }
        </ol>
      </div>
      <h2 className="bookshelf-title">{shelfTitle}</h2>
    </div>
  )
}

export default BookShelf
import React from 'react'
import Book from './Book'
// import * as BooksAPI from './BooksAPI'

const BookShelf = ({ shelfTitle, books, updateShelf }) => {
  const currentBookShelf = books.filter(books => books.status === shelfTitle)
  return (
    <div className="list-books-content">
      <div className="bookshelf">
        <h2 className="bookshelf-title">{shelfTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
          {currentBookShelf.map((book) => (
            <Book
            shelfTitle={ shelfTitle }
            updateShelf={(target, book) => this.updateShelf(target, book)}
            />
          )) }
          </ol>
        </div>
      </div>
    </div>
  )
}

export default BookShelf
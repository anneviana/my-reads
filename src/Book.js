import React from 'react'

const Book = ({ book, updateShelf, shelfTitle, status, bookInfo }) => {
  return (
    <div>
      <li key={book.id}>
        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{
              width: 128, height: 193,
              backgroundImage: `url(${book.imageLinks.thumbnail})`}}></div>
            <div className="book-shelf-description tooltip">
              <span className="tooltiptext">{book.title}</span>
            </div>,
            <div className="book-shelf-changer tooltip">
              <span className="tooltiptext">Change bookshelf</span>
              <select onChange={(e) => updateShelf(e.target, book)}>
                <option value="none" disabled>Move to...</option>
                <option value="none">None</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read </option>
              </select>
            </div>
          </div>
        </div>
      </li>
    </div>
  )
};

export default Book
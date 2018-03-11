import React, {Component} from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Search from './SearchBook'
import BookShelf from './BookShelf'
import './App.css'

class BooksApp extends Component {
    /**
     * @typedef {Object} ComponentState
     * @property {Object[]} books - All books that has been set a  state.
     * @property {string} query - Search term input.
     * @property {string} status - the chosen shelf.
     * @property {Object[]} searchResults - All books returned from the search.
     */
    state = {
      books: [],
      query: '',
      status: 'none',
      searchRecords: [],
    };
  /**
  * @description Mount the "myReadsShelves" storage from books state
  * @returns {object} The books state with the storage data
  */
  componentWillMount() {
    const myReadsShelves = window.localStorage.getItem('myReadsShelves') || '[]'
    window.localStorage.getItem('myReadsShelves') ? this.setState({ books: JSON.parse(myReadsShelves) }) : this.getAllBooks()
  };
  /**
  * @description Change the book on the shelf
  * @param {object} books
  * @param {event} the event target
  * @returns {object} Update the storage and set the books state concatenating shelf
  */
  updateLocalStorage(books) {
    const stringfiedShelves = JSON.stringify(books)
    window.localStorage.setItem('myReadsShelves', stringfiedShelves)
    this.setState({ books })
  };
  /**
  * @description Change the book on the shelf
  * @param {object} books
  * @param {event} the event target
  * @returns {object} Update the storage and set the books state concatenating shelf
  */
  updateShelf = (target, book) => {
    let { books } = this.state
      books = books.filter(b => b.id !== book.id).concat({
        ...book,
        shelf: target.selected ? 'none' : target.value
      })
    BooksAPI.update(books, target.value).then((book) => {
    })
    // if (target.value === book.shelf) {
    //   target.selected = 'selected'
    // } else {
    //   target.selected = 'none'
    // }
    // Update the "books" state and "myReadsShelves" storage
    this.updateLocalStorage(books)
  };
  /**
  * @description Update the search
  * @param {string} query
  * @returns {object} The object of the "searchResults" state
  */
  updateQuery = (query, books) => {
    this.setState({ query: query.trim() })
    this.search(query, books)
  };
  /**
  * @description Cleans the previously search
  * @returns {object} The object "books" state
  */
  clearQuery = () => {
    this.setState({ query: '' })
  };
  /**
  * @description Get all default books and their respective shelves
  * @returns {object} The object "books" state
  */
  getAllBooks = () => {
    // Inside catch block the context change so assign like this to reference the app context not the catch context
    const app = this;
    // Update the Shelves
    BooksAPI.getAll().then((books) => {
      app.setState({books: books});
    })
  };
  /**
  * @description Search books for the query state.
  * @param {string} query
  * @param {object} books
  * @returns {object} The searched books from query
  */
  search = (query, book) => {
    if (query.trim() === '') {
      this.setState({query: '', searchResults: []});
      return;
    }

    BooksAPI.search(query).then((books) => {
      // If the query state (the search input) changed while the request was in process not show the books
      // of a previous query state
      if (query !== this.state.query) return;

      //If the query is empty no need to request to server just clean the books array
      if ('error' in books) {
        books = []
      }
      else {
        const teste =  books.map(book => (this.state.books.filter(
          (b) => b.id === book.id).map(b => book.shelf = b.shelf)))
          //books.map(book => (this.state.books.filter((b) => b.id === book.id).map(b => book.shelf = b.shelf)));
        const stringfiedShelves = JSON.stringify(teste)
        window.localStorage.setItem('buscamotherfucker', stringfiedShelves)
        this.setState({
          searchRecords: teste
        })
      }
      // this.setState({
      //   searchResults: books.sort(sortBy('title'))
      // });
    })
  };
  render() {
    const { books } = this.state
    const bookShelf = [
      { title: 'Currently Reading', books, status: 'currentlyReading' },
      { title: 'Want to Read', books, status: 'wantToRead' },
      { title: 'Read', books, status: 'read' }
    ]
    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div>
            <div className="list-books-content">
              {bookShelf.map(shelf => (
                <BookShelf
                  updateShelf={(target, book) => this.updateShelf(target, book)}
                  key={shelf.title}
                  status={shelf.status}
                  shelfTitle={shelf.title}
                  books={shelf.books}
                />
                ))}
              </div>
              <div className="open-search">
                <Link to='/search'>Add a book</Link>
              </div>
            </div>
          </div>
        )}/>
        <Route exact path='/search' render={(history) => (
          <Search
          updateShelf={(target, book) => this.updateShelf(target, book)}
          key={books.title}
          books={this.state.books}
          query={this.state.query}
          updateQuery={(query, book) => this.updateQuery(query, book)}
          onSearch={this.search} />
        )}/>
      </div>
    )
  }
}

export default BooksApp

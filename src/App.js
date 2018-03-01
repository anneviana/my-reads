import React, {Component} from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Search from './SearchBook'
import sortBy from 'sort-by'
import BookShelf from './BookShelf'
import './App.css'

class BooksApp extends Component {
    /** @type {ComponentState} */
    state = {
      books: [],
      query: '',
      status: 'None'
    };

  componentWillMount() {
    const myReadsShelves = window.localStorage.getItem('myReadsShelves') || '[]'
    window.localStorage.getItem('myReadsShelves') ? this.setState({ books: JSON.parse(myReadsShelves) }) : this.getAllBooks()
  }

  updateLocalStorage(books) {
    const stringfiedShelves = JSON.stringify(books)
    window.localStorage.setItem('myReadsShelves', stringfiedShelves)
    this.setState({ books })
  }

  updateShelf = (target, book) => {
    let { books } = this.state
    books = books.filter(b => b.id !== book.id).concat({
      ...book,
      shelf: target.selected ? 'None' : target.value
    })
    console.log(target.value)
    console.log(book.shelf)
    if (target.value === book.shelf) {
      target.selected = 'selected'
    } else {
      target.selected = 'none'
    }

    this.updateLocalStorage(books)
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
    this.search(query)
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  getAllBooks = () => {
    // Inside catch block the context change so assign like this to reference the app context not the catch context
    const app = this;
    // Update the Shelves
    BooksAPI.getAll().then((books) => {
      app.setState({books: books});
    })
  }

  /**
   * @description Search books for the query state.
   */
  search = (query, books) => {
    //const query = this.state.query;
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
        books.map(book =>
          (this.state.books.filter(
            (b) => b.id === book.id).map(b => book.shelf = b.shelf).concat({
              ...book,
              testeXablau: 'None'
            })
          )
        );
      }
      this.setState({
        searchResults: books.sort(sortBy('title'))
      });
      console.log(books)
      this.setState({ books })
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
          updateQuery={this.updateQuery}
          onSearch={this.search} />

        )}/>
      </div>
    )
  }
}

export default BooksApp

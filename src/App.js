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
    };
  componentWillMount() {
    this.getAllBooks()
  }
  getAllBooks = () => {
    // Inside catch block the context change so assign like this to reference the app context not the catch context
    const app = this;
    // Update the Shelves
    BooksAPI.getAll().then((books) => {
      app.setState({books: books});
    })
  }

  updateShelf = (book) => {
    console.log('update');
  }

  /**
   * @description Search books for the query state.
   */
  search = () => {
    const query = this.state.query;
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
        books.map(book => (this.state.books.filter((b) => b.id === book.id).map(b => book.shelf = b.shelf)));
      }
      this.setState({
        searchResults: books.sort(sortBy('title'))
      });
    })
  };
  render() {
    const { books } = this.state
    const bookShelf = [
      { title: 'Currently Reading', books },
      { title: 'Want to Read', books },
      { title: 'Read', books }
    ]
    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div>
            {bookShelf.map(shelf => (
              <BookShelf
                updateShelf={(target, book) => this.updateShelf(target, book)}
                key={shelf.title}
                shelfTitle={shelf.title}
                books={shelf.books}
              />
              ))}
              <div className="open-search">
                <Link to='/search'>Add a book</Link>
              </div>
            </div>
          </div>
        )}/>
        <Route exact path='/search' render={(history) => (
          <Search
          updateShelf={books}
          key={books.title}
          books={this.state.books}
          query={this.state.query}
          onUpdateQuery={this.updateQuery}
          onSearch={this.search} />
        )}/>
      </div>
    )
  }
}

export default BooksApp

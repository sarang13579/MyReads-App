import React from 'react'
import {Route} from 'react-router-dom';

import * as BooksAPI from './BooksAPI'
import * as BookUtils from './BookUtils';

import './App.css'
import BookCase from './components/BookCase';
import Search from './components/Search';

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
  }

  componentDidMount = () => {
    if (this.state.newBook) {
      this.refreshAllBooks();
    }
  }

  refreshAllBooks = () => {
    // Get the books currently on the bookshelves and update the state with the
    // returned, sorted list
    BooksAPI
      .getAll()
      .then((list) => {
        this.setState({
          books: BookUtils.sortAllBooks(list),
          newBook: false
        });
      });
  }

changeShelf = (book, shelf) => {
    // Make the call to the service to update the shelf for the selected book to the
    // newly selected shelf
    BooksAPI
      .update(book, shelf)
      .then(response => {
        // Update the state of the book. Start with a copy of the list of books.
        let newList = this
          .state
          .books
          .slice(0);
        // Look for the book in the list. It might not be there yet.
        const books = newList.filter(listBook => listBook.id === book.id);
        if (books.length) {
          // Update the book that's already on the shelf
          books[0].shelf = shelf;
        } else {
          // Add the book to the shelf and sort the list of books again
          newList.push(book);
          newList = BookUtils.sortAllBooks(newList);
        }
        // Update the state with the newList
        this.setState({books: newList});
      })
  }

  render() {
     return (
      <div className="app">
        <Route
          exact
          path='/'
          render={(() => (<BookCase
      books={this.state.books}
       onChangeShelf={this.changeShelf}
          onRefreshAllBooks={this.refreshAllBooks}/>))}/>

        <Route
          exact
          path='/search'
          render={(() => (<Search selectedBooks={this.state.books} onChangeShelf={this.changeShelf}/>))}/>

      </div>
    )
  }
}

export default BooksApp

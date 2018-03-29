import React from 'react';
import ReactDOM from 'react-dom';
import styles from './style.css';

class App extends React.Component {

  render () {
    return (
      <div className="app">
        Hello World!
      </div>
      )
  }
}

ReactDOM.render(<App/>, document.querySelector('.content'));


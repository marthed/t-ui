require('babel-polyfill');
require('babel-core/register');
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styles from './style.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      isLoggedIn: false,
      accessToken: null
    }
  }

  login = async () => {
    try {
     const res = await axios.request({
        url: '/login',
        method: 'GET',
      });
      console.log('res: ', res);
      this.setState({isLoggedIn: true, accessToken: res.data.token});
    } catch (error) {
      console.log(error);
      this.setState({isLoggedIn: false, accessToken: null});
    }
    
  }

  componentWillMount() {
    this.login();
  }

  render () {
    const { isLoggedIn } = this.state;
    return (
      <div className="main-container">
        <div className="main-title">T-UI</div>
        <div className="button-container">
          {!isLoggedIn && <button>Login</button>}
          {isLoggedIn && <div>LOGGED IN!</div>}
        </div>
      </div>
      )
  }
}

ReactDOM.render(<App/>, document.querySelector('.content'));


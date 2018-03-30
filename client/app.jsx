require('babel-polyfill');
require('babel-core/register');
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styles from './style.css';
import { facebookAccessToken } from './accessToken';

const userID = '712536446';

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
      const { data: { token }} = await axios.request({
        url: 'https://api.gotinder.com/auth',
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
        },
        data: JSON.stringify({facebook_token: facebookAccessToken, facebook_id: userID})
      });
      this.setState({isLoggedIn: true, accessToken: token});
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


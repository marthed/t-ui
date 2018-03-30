require('babel-polyfill');
require('babel-core/register');
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import styles from './style.css';
import MainContainer from './components/mainContainer.jsx';

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
      this.setState({ isLoggedIn: true, accessToken: res.data.token});
      sessionStorage.setItem('loginTime', moment().valueOf());
      sessionStorage.setItem('accessToken', res.data.token);
    } 
    catch (error) {
      console.log(error);
      this.setState({isLoggedIn: false, accessToken: null});
    }
  }

  checkLoginStatus = () => {
    const loginTime = sessionStorage.getItem('loginTime');
    
    if (loginTime) {
      if (moment(Number(loginTime)).add(2, 'hours') > moment().valueOf()) {
        console.log('Already logged in');
        this.setState({ isLoggedIn: true, accessToken: sessionStorage.getItem('accessToken')});
      }
      else {
        console.log('Token expiered!');
        sessionStorage.setItem('accessToken', null);
      }
    }
    if (!loginTime) {
      console.log('Have not logged in in current session');
      this.login();
    }
  }

  componentWillMount() {
    this.checkLoginStatus();
  }

  render () {
    const { isLoggedIn, accessToken } = this.state;
    return (
      <div className="app-container">
        <div className="main-title">T-UI</div>
          {isLoggedIn ?
            <MainContainer accessToken={accessToken}/> :
            <div className="button-container">
              <button onClick={this.login}>Login</button>
            </div>}
        </div>
      )
  }
}

ReactDOM.render(<App/>, document.querySelector('.content'));


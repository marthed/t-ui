require('babel-polyfill');
require('babel-core/register');
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';

import './style.css';
import './utils/storage.js';
import MainContainer from './components/mainContainer.jsx';
import Login from './components/login/login.jsx';

const errorText = 'Något gick fel, prova igen.'
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      isLoggedIn: false,
      isLoggingIn: false,
      accessToken: null,
      userId: null,
      confirmType: '',
      confirmValue: '',
    }
  }

  login = async (email, password) => {
    this.setState({isLoggingIn: true});
    try {
      const res = await axios.request({
        url: '/login',
        method: 'POST',
        data: {
          email,
          password,
        },
      });

      console.log(res);

      if (res.data.confirmType === 'birthday') {
        this.setState({ confirmType: 'birthday', isLoggingIn: false });
      }
      else if (res.data.confirmType === 'device') {
        this.setState({ confirmType: 'device', isLoggingIn: false });
      }
      else {
        this.setState(
          {
            isLoggedIn: true,
            isLoggingIn: false,
            userId: res.data.userId,
            accessToken: res.data.tinderToken,
          });
        sessionStorage.setItem('loginTime', moment().valueOf());
        sessionStorage.setItem('accessToken', res.data.tinderToken);
        sessionStorage.setItem('userId', res.data.userId);
      }
    }
    catch (error) {
      console.log('Error: ', error.message);
      this.setState({ errorText, isLoggedIn: false, accessToken: null, isLoggingIn: false, userId: null });
    }
  }

  checkLoginStatus = () => {
    const loginTime = sessionStorage.getItem('loginTime');
    const accessToken = sessionStorage.getItem('accessToken');
    console.log('accessToken: ', accessToken);
    console.log('loginTime: ', loginTime);
    
    if (loginTime && (accessToken !== 'undefined')) {
      if (moment(Number(loginTime)).add(2, 'hours') > moment().valueOf()) {
        console.log('Already logged in');
        this.setState({ isLoggedIn: true, accessToken });
      }
      else {
        console.log('Token expiered!');
        sessionStorage.setItem('accessToken', undefined);
        sessionStorage.setItem('loginTime', null);
      }
    }
  }

  confirmLogin = ({ type, value }) => async () => {
    this.setState({ isLoggingIn: true });
    try {
      const res = await axios.request({
        url: '/login/confirm',
        method: 'POST',
        data: {
          type,
          value,
        },
      });
      console.log('Confirm Login');
      console.log(res);
      this.setState({ isLoggedIn: true, isLoggingIn: false, accessToken: res.data.tinderToken, userId: res.data.userId});
      sessionStorage.setItem('loginTime', moment().valueOf());
      sessionStorage.setItem('accessToken', res.data.tinderToken);

    }
    catch (error) {
      console.log(error.message);
      this.setState({ errorText, isLoggedIn: false, accessToken: null, isLoggingIn: false});
    }
  }

  componentWillMount() {
    this.checkLoginStatus();
  }

  render () {
    const { isLoggedIn, isLoggingIn, accessToken, confirmType, userId, errorText } = this.state;
    return (
      <div className="app-container">
        <div className="main-title">T-UI</div>
        {isLoggedIn ?
          <MainContainer accessToken={accessToken} userId={userId}/> :
          <Login
            onConfirm={this.login}
            isLoggingIn={isLoggingIn}
            confirmType={confirmType}
            confirmLogin={this.confirmLogin}
            errorText={errorText}
          />
        }
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.querySelector('.content'));


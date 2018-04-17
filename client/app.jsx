require('babel-polyfill');
require('babel-core/register');
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';

import styles from './style.css';
import MainContainer from './components/mainContainer.jsx';
import Login from './components/login.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      isLoggedIn: false,
      accessToken: null,
      isLoggingIn: false,
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
          password
        }
      });
      console.log('res: ', res);
      this.setState({ isLoggedIn: true, isLoggingIn: false, accessToken: res.data.tinderToken});
      sessionStorage.setItem('loginTime', moment().valueOf());
      sessionStorage.setItem('accessToken', res.data.tinderToken);
    } 
    catch (error) {
      console.log(error.message);
      this.setState({isLoggedIn: false, accessToken: null, isLoggingIn: false});
    }
  }

  renderDebugImages = () => {
    return (
      <div className="debug-image-container">
        <img src="http://localhost:7777/images/chrome.png"/>
      </div>
    )
  }

  checkLoginStatus = () => {
    const loginTime = sessionStorage.getItem('loginTime');
    const accessToken = sessionStorage.getItem('accessToken');
    console.log('accessToken: ', accessToken);
    console.log('loginTime: ', loginTime);
    
    if (loginTime && (accessToken !== 'undefined')) {
      if (moment(Number(loginTime)).add(2, 'hours') > moment().valueOf()) {
        console.log('Already logged in');
        this.setState({ isLoggedIn: true, accessToken: sessionStorage.getItem('accessToken')});
      }
      else {
        console.log('Token expiered!');
        sessionStorage.setItem('accessToken', null);
        sessionStorage.setItem('loginTime', null);
      }
    }
  }

  componentWillMount() {
    this.checkLoginStatus();
  }

  render () {
    const { isLoggedIn, isLoggingIn, accessToken } = this.state;
    return (
      <div className="app-container">
        <div className="main-title">T-UI</div>
          {isLoggedIn ?
            <MainContainer accessToken={accessToken}/> :
            <div>
            <div className="button-container">
              <Login onConfirm={this.login} isLoggingIn={isLoggingIn} />
            </div>
            {this.renderDebugImages()}
            </div>}
        </div>
      )
  }
}

ReactDOM.render(<App/>, document.querySelector('.content'));


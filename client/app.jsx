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
          password
        }
      });

      if (res.data.confirmType === 'birthday') {
        this.setState({ confirmType: 'birthday', isLoggingIn: false });
      }
      else if (res.data.confirmType === 'device') {
        this.setState({ confirmType: 'device', isLoggingIn: false });
      }
      else {
        console.log('res: ', res);
        this.setState({ isLoggedIn: true, isLoggingIn: false, accessToken: res.data.tinderToken});
        sessionStorage.setItem('loginTime', moment().valueOf());
        sessionStorage.setItem('accessToken', res.data.tinderToken);
      }
    } 
    catch (error) {
      console.log(error.message);
      this.setState({isLoggedIn: false, accessToken: null, isLoggingIn: false});
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
        this.setState({ isLoggedIn: true, accessToken: sessionStorage.getItem('accessToken')});
      }
      else {
        console.log('Token expiered!');
        sessionStorage.setItem('accessToken', null);
        sessionStorage.setItem('loginTime', null);
      }
    }
  }

  confirmLogin = ({type, value }) => async () => {
    console.log('type: ', type);
    console.log('value: ', value);
    this.setState({ isLoggingIn: true});
    try {
     const res = await axios.request({
        url: '/login/confirm',
        method: 'POST',
        data: {
          type,
          value,
        }
      });
      console.log('Confirm Login');
      console.log(res);
      

    }
    catch (error) {
      console.log(error.message);
      this.setState({isLoggedIn: false, accessToken: null, isLoggingIn: false});
    }
  }

  renderConfirmLogin = () => {
    const { confirmType, confirmValue, isLoggingIn } = this.state;
    if (confirmType === 'device') {
      return (
      <div className="confirmLogin">
        <label>Logga in på en enhet du använt tidigare</label>
        <button onClick={this.confirmLogin({type: confirmType})} disabled={isLoggingIn}>Fortsätt</button>
      </div>
      )
    };
    return (
      <div className="confirmLogin">
        <label>Ange ditt födelsedatum</label>
        <input type="date" name="bday" onChange={(date) => this.setState({confirmValue: date})} />
        <button onClick={this.confirmLogin({type: confirmType, value: confirmValue })} disabled={isLoggingIn}>Fortsätt</button>
      </div>
      )
  }

  componentWillMount() {
    this.checkLoginStatus();
  }

  render () {
    const { isLoggedIn, isLoggingIn, accessToken, confirmType } = this.state;
    return (
      <div className="app-container">
        <div className="main-title">T-UI</div>
          {isLoggedIn ?
            <MainContainer accessToken={accessToken}/> :
            <div>
            <div className="button-container">
              <Login onConfirm={this.login} isLoggingIn={isLoggingIn} />
              {confirmType && this.renderConfirmLogin()}
            </div>
            </div>}
        </div>
      )
  }
}

ReactDOM.render(<App/>, document.querySelector('.content'));


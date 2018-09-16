import React from 'react';
import PropTypes from 'prop-types';
import './login.css';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      missingInput: false,
      confirmValue: null,
    }
  }

  componentDidMount(){
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount(){
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = ({ key }) => {
    switch (key) {
      case 'Enter':
        this.onConfirm();
        break;
      default:
        break;
    }
  };

  onChange = (type) => (evt) => {
    this.setState({ [type]: evt.target.value });
  }

  onConfirm = () => {
    const { email, password } = this.state;
    const missingInput = this.getMissingInput();
    if (missingInput) this.setState({ missingInput });
    else this.props.onConfirm(email, password);
  }

  renderConfirmLogin = () => {
    const { confirmType, isLoggingIn, confirmLogin } = this.props;
    const { confirmValue } = this.state;

    if (confirmType === 'device') {
      return (
      <div className="confirmLogin">
        <label>Logga in på en enhet du använt tidigare</label>
        <button onClick={confirmLogin({ type: confirmType})} disabled={isLoggingIn}>Fortsätt</button>
      </div>
      )
    }
    return (
      <div className="confirmLogin">
        <label>Ange ditt födelsedatum</label>
        <input type="date" name="bday" onChange={(date) => this.setState({ confirmValue: date })} />
        <button onClick={confirmLogin({ type: confirmType, value: confirmValue })} disabled={isLoggingIn}>Fortsätt</button>
      </div>
      )
  }

  getMissingInput = () => {
    const { email, password } = this.state;
    if (!email && !password) return 'email och lösenord';
    if (!email) return 'email';
    if (!password) return 'lösenord';
    return '';
  }

  render() {
    const { isLoggingIn, confirmType, errorText } = this.props;
    const { email, password, missingInput } = this.state;

    return (
    <div className="login">
      {confirmType && this.renderConfirmLogin()}
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={email}
        onChange={this.onChange('email')}
      />
      <label>Lösenord</label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={this.onChange('password')}
      />
      <button onClick={this.onConfirm} disabled={isLoggingIn}>Login</button>
      {missingInput &&
        <span className="login__missing-input"> {`Fyll i ${missingInput}`}</span>
      }
      {errorText}
    </div>
    )
  }
}

Login.prototypes = {
  onConfirm: PropTypes.func.isRequired,
  confirmLogin: PropTypes.func.isRequired,
  isLoggingIn: PropTypes.bool,
  confirmType: PropTypes.string,
  errorText: PropTypes.string,
}

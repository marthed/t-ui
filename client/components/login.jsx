import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  onChange = (type) => (evt) => {
    this.setState({ [type]: evt.target.value });
  }

  onConfirm = (email, password) => () => {
    this.props.onConfirm(email, password);
  }

  render() {
    const { onConfirm, isLoggingIn } = this.props;
    const { email, password } = this.state;

    return (
    <div className="login">
      <label>Email</label>
      <input
        placeholder="Email"
        type="email"
        name="email"
        value={email}
        onChange={this.onChange('email')}
      />
      <label>Lösenord</label>
      <input
        placeholder="Lösenord"
        type="password"
        name="password"
        value={password}
        onChange={this.onChange('password')}
      />
      <button onClick={this.onConfirm(email, password)} disabled={isLoggingIn}>Login</button>
    </div>
    )
  }
}
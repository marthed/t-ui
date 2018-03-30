import React from 'react';
import axios from 'axios';

export default class MainContainer extends React.Component {

  getMatches = async () => {
    console.log('Getting matches...');
    const { accessToken } = this.props;
    try {
      const res = await axios.request({
        url: '/matches',
        method: 'POST',
        data: {
          accessToken
        }
      });
      console.log(res);
    }
    catch (error) {
      console.log(error);
    }
  };

  render () {

    return (
    <div>
      <button onClick={this.getMatches}>Get Matches</button>
    </div>
    )
  }
  
}

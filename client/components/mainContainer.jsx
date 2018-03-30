import React from 'react';
import axios from 'axios';
import MatchBox from './matchBox.jsx';

export default class MainContainer extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      matches: []
    }
  }
  
  componentDidMount() {
    const matches = sessionStorage.getItem('matches');
    if (matches) {
      console.log('set matches from session');
      this.setState({ matches: JSON.parse(matches) });
    }
  }

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
      const { matches } = res.data.data;
      sessionStorage.setItem('matches', JSON.stringify(matches));
      this.setState({ matches });
    }
    catch (error) {
      console.log(error);
    }
  };

  renderMatches = () => {
    const { matches } = this.state;
    return matches.map((match, idx) => {
      return <MatchBox key={idx} match={match} />
    });
  }

  render () {
    return (
      <div className="main-container">
        <div className="button-container">
          <button onClick={this.getMatches}>Get Matches</button>
        </div>
        <div className="main-container__matches">
          {this.renderMatches()}
        </div>
    </div>
    )
  }
  
}

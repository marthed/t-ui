import React from 'react';
import axios from 'axios';
import MatchBox from './matchBox.jsx';
import FilterContainer from './filterContainer/filterContainer.jsx';
import { getMatches } from '../utils/webAPI';

export default class MainContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      isFetching: false,
      filter: {},
    }
  }

  getMatches = async () => {
    const { accessToken, userId } = this.props;
    const pageToken = sessionStorage.getItem('pageToken');
    const filter = sessionStorage.getItem('filter');
    this.setState({ isFetching: true });

    try {
      const matches=[] = await getMatches({ accessToken, pageToken, userId, filter });
      this.setState({ matches, isFetching: false });
      console.log('matches: ', matches);
    }
    catch (error) {
      this.setState({ isFetching: false });
      console.log(error);
    }
  };

  renderMatches = () => {
    const { matches=[], isFetching, filters } = this.state;
    if (!matches.length) return null;
    return matches.map((match, idx) => {
      return <MatchBox key={idx} match={match} />
    })
    .concat(
      <div key="load-more" className="button-container__more-matches">
        <button
          disabled={isFetching}
          onClick={this.getMatches}>
          {isFetching ? "Hämtar..." :"Ladda fler matchningar"}
          </button>
      </div>
    );
  }

  setFilter = () =>

  render () {
    const { matches=[], isFetching, filter } = this.state;

    return (
      <div className="main-container">
        {matches.length === 0 && 
        <div className="button-container">
          <button
            disabled={isFetching}
            onClick={this.getAllMatches}>
            {isFetching ? 'Hämtar...' : "Hämta alla matchningar"}
          </button>
        </div>}
        {matches.length > 0 &&
        <FilterContainer
          getMatches={this.getMatches}
          isFetching={isFetching}
          filter={filter}
        />
        }
        <div className="main-container__matches">
          {this.renderMatches()}
        </div>
    </div>
    )
  }
  
}

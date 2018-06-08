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
      filters: null,
    }
  }

  getAllMatches = async () => {
    const { accessToken, userId } = this.props;
    const pageToken = sessionStorage.getItem('pageToken');
    this.setState({ isFetching: true });

    try {
      const matches=[] = await getMatches({ accessToken, pageToken, userId });
      this.setState({ matches, isFetching: false });
      console.log('matches: ', matches);
    }
    catch (error) {
      this.setState({ isFetching: false });
      console.log(error);
    }
  };
  
  setFilters = (filters) => this.setState({ filters });
  
  filter = (filter, match, filters) => {
    switch (filter) {
      case 'distance_mi':
        return match[filter] < filters[filter];
      default:
        return false;
    };
  }

  filterMatches = (matches, filters) => {
    if (!filters || filters.length === 0) return matches;
    const filterKeys = Object.keys(filters);
    return matches.filter((match) => {
      const hej = filterKeys.filter((filter) => this.filter(filter, match, filters));
      if (!hej || hej.length === 0) return false;
      return true;
    });
  }


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

  render () {
    const { matches=[], isFetching, filters } = this.state;

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
          setFilters={this.setFilters}
          isFetching={isFetching}
          filters={filters}
        />
        }
        <div className="main-container__matches">
          {this.renderMatches()}
        </div>
    </div>
    )
  }
  
}

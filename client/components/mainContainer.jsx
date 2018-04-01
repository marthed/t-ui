import React from 'react';
import axios from 'axios';
import MatchBox from './matchBox.jsx';
import FilterContainer from './filterContainer.jsx';

export default class MainContainer extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      isFetching: false,
      filters: null,
    }
  }
  
  componentDidMount() {
    const matches = sessionStorage.getItem('matches');
    if (matches) {
      console.log('Set matches from session');
      this.setState({ matches: JSON.parse(matches) });
    }
  }

  getMatches = async () => {
    console.log('Getting matches...');
    const { accessToken } = this.props;
    const pageToken = sessionStorage.getItem('pageToken');
    this.setState({isFetching: true});

    try {
      const res = await axios.request({
        url: '/matches',
        method: 'POST',
        data: {
          accessToken,
          pageToken
        }
      });
      const { matches, next_page_token} = res.data;
      const storedMatches = sessionStorage.getItem('matches');
      const allMatches = storedMatches ? JSON.parse(storedMatches).concat(matches) : matches;

      sessionStorage.setItem('matches', JSON.stringify(allMatches));
      sessionStorage.setItem('pageToken', JSON.stringify(next_page_token));
      this.setState({ matches: allMatches });
      this.setState({isFetching: false});
    }
    catch (error) {
      this.setState({isFetching: false});
      console.log(error);
    }
  };

  filter = (filter, match) => {
    const { filters } = this.state;
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
      const hej = filterKeys.filter((filter) => this.filter(filter, match));
      if (!hej || hej.length === 0) return false;
      return true;
    });
  }

  setFilters = (filters) => this.setState({ filters: filters });

  renderMatches = () => {
    const { matches, isFetching, filters } = this.state;
    // console.log('matches: ', matches);
    if (!matches || matches.length === 0) return null;
    const filteredMatches = filters ? this.filterMatches(matches, filters) : matches;
    console.log('filteredMatches: ', filteredMatches);

    return filteredMatches.map((match, idx) => {
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
    const { matches, isFetching } = this.state;

    return (
      <div className="main-container">
        {matches.length === 0 && 
        <div className="button-container">
          <button
            disabled={isFetching}
            onClick={this.getMatches}>
            {isFetching ? 'Hämtar...' : "Hämta matchningar"}
          </button>
        </div>}
        {matches.length > 0 &&
        <FilterContainer
          setFilters={this.setFilters}
          isFetching={isFetching}
        />
        }
        <div className="main-container__matches">
          {this.renderMatches()}
        </div>
    </div>
    )
  }
  
}

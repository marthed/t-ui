import React from 'react';
import MatchBox from './matchBox.jsx';
import FilterContainer from './filterContainer/filterContainer.jsx';
import { getMatches } from '../utils/webAPI';
import PropTypes from 'prop-types';

export default class MainContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      isFetching: false,
      filter: {},
    }
  }

  componentDidMount() {
    const matches = localStorage.getObj('matches');
    console.log('matches: ', matches);
    console.log('matches: ', typeof matches);
    const filter = localStorage.getObj('filter') || {};
    console.log('filter: ', filter);
    console.log('filter: ', typeof filter);
    if (matches) {
      this.setState({ matches, filter });
    }
    else {
      this.setState({ filter }, () => {
        this.getMatches();
      });
    }
  }

  getMatches = async () => {
    const { accessToken } = this.props;
    const userId = sessionStorage.getItem('userId');
    console.log('userId: ', userId);
    const filter = this.state.filter;
    this.setState({ isFetching: true });

    try {
      const matches = await getMatches({ accessToken, userId, filter });
      this.setState({ matches, isFetching: false });
      localStorage.setObj('matches', matches);
    }
    catch (error) {
      this.setState({ isFetching: false });
      console.log(error);
    }
  };

  renderMatches = () => {
    const { matches=[], isFetching } = this.state;
    if (!matches.length) return null;
    return matches.map((match, idx) => {
      return <MatchBox key={idx} match={match} />
    })
    .concat(
      <div key="load-more" className="button-container__more-matches">
        <button
          tabIndex={-1}
          disabled={isFetching}
          onClick={this.getMatches}>
          {isFetching ? "Hämtar..." :"Ladda fler matchningar"}
          </button>
      </div>
    );
  }

  setFilter = filter => this.setState({ filter }, () => {
    localStorage.setObj('filter', filter);
    this.getMatches();
  });

  render () {
    const { matches=[], isFetching, filter } = this.state;

    return (
      <div className="main-container">
        {!matches.length && 
        <div className="button-container">
          <button
            disabled={isFetching}
            onClick={this.getMatches}>
            {isFetching ? 'Hämtar...' : "Hämta alla matchningar"}
          </button>
        </div>}
        {matches.length > 0 &&
        <FilterContainer
          isFetching={isFetching}
          filter={filter}
          setFilter={this.setFilter}
        />
        }
        <div className="main-container__matches">
          {this.renderMatches()}
        </div>
    </div>
    )
  }
}

MainContainer.propTypes = {
  accessToken: PropTypes.string.isRequired,
}

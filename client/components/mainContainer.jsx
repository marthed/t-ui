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

  getMatches = async () => {
    const { accessToken } = this.props;
    const userId = sessionStorage.getItem('userId');
    console.log('userId: ', userId);
    const filter = sessionStorage.getItem('filter');
    this.setState({ isFetching: true });

    try {
      const matches = await getMatches({ accessToken, userId, filter });
      this.setState({ matches, isFetching: false });
      console.log('matches: ', matches);
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
          disabled={isFetching}
          onClick={this.getMatches}>
          {isFetching ? "Hämtar..." :"Ladda fler matchningar"}
          </button>
      </div>
    );
  }

  setFilter = filter => this.setState({ filter });

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

MainContainer.propTypes = {
  accessToken: PropTypes.string.isRequired,
}

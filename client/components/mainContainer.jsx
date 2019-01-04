import React from 'react';
import MatchBox from './matchBox.jsx';
import MatchModal from './matchModal/matchModal.jsx';
import FilterContainer from './filterContainer/filterContainer.jsx';
import { getMatches, getMatchesAndSync } from '../utils/webAPI';
import PropTypes from 'prop-types';

export default class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      isFetching: false,
      filter: {},
    };
  }

  componentDidMount() {
    const matches = localStorage.getObj('matches');
    const filter = localStorage.getObj('filter') || {};
    if (matches) {
      this.setState({ matches, filter });
    } else {
      this.setState({ filter }, () => {
        this.getMatches();
      });
    }
  }

  getMatches = async route => {
    const { accessToken, userId: propUserId } = this.props;
    const userId = propUserId || sessionStorage.getItem('userId');
    const filter = this.state.filter;
    this.setState({ isFetching: true });

    const matchRoutes = {
      syncPage: getMatchesAndSync,
    }

    const getTheMatches = matchRoutes[route] || getMatches

    try {
      const matches = await getTheMatches({ accessToken, userId, filter });
      console.log('matches: ', matches);
      let updatedMatches;
      if (route) {
        updatedMatches = this.state.matches.concat(matches);
      }
      else {
        updatedMatches = this.state.matches;
      }
      this.setState({ matches: updatedMatches, isFetching: false });
      localStorage.setObj('matches', updatedMatches);
    } catch (error) {
      this.setState({ isFetching: false });
      console.log(error);
    }
  };

  renderMatches = () => {
    const { matches = [], isFetching } = this.state;
    if (!matches.length) return null;
    return matches
      .map((match, idx) => {
        return (
          <MatchBox onClick={this.openMatchModal} key={idx} match={match} />
        );
      })
      .concat(
        <div key="load-more" className="button-container__more-matches">
          <button tabIndex={-1} disabled={isFetching} onClick={this.getMatches}>
            {isFetching ? 'Hämtar...' : 'Ladda fler matchningar'}
          </button>
        </div>
      );
  };

  setFilter = filter =>
    this.setState({ filter }, () => {
      localStorage.setObj('filter', filter);
      this.getMatches();
    });

  openMatchModal = matchId => this.setState({ shouldRenderModal: true, selectedMatch: matchId })

  closeMatchModal = () => this.setState({ shouldRenderModal: false, selectedMatch: null })

  render() {
    const {
      matches = [],
      isFetching,
      filter,
      shouldRenderModal,
      selectedMatch,
    } = this.state;

    return (
      <div className="main-container">
        {shouldRenderModal ? (
          <MatchModal
            selectedMatch={selectedMatch}
            onOutsideClick={this.closeMatchModal}
          />
        ) : null}
        <div className="info-container">
          <label>Matchningar: </label><div>{matches.length} </div>
          <button disabled={isFetching} onClick={() =>this.getMatches('syncPage')}>Synka fler matchningar</button>
        </div>
        <FilterContainer
          isFetching={isFetching}
          filter={filter}
          setFilter={this.setFilter}
        />
        {!matches.length && (
          <div className="button-container">
            <button disabled={isFetching} onClick={this.getMatches}>
              {isFetching ? 'Hämtar...' : 'Hämta alla matchningar'}
            </button>
          </div>
        )}
        <div className="main-container__matches">{this.renderMatches()}</div>
      </div>
    );
  }
}

MainContainer.propTypes = {
  accessToken: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

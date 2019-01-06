import React from 'react';
import MatchBox from './matchBox/matchBox.jsx';
import MatchModal from './matchModal/matchModal.jsx';
import FilterContainer from './filterContainer/filterContainer.jsx';
import { getMatches, syncMatches, getMetaData } from '../utils/webAPI';
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

  async componentDidMount() {
    const { data } = await getMetaData({ totalMatches: true });
    console.log('totalMatches: ', data.totalMatches);
    await this.getMatches();
    this.setState({ totalMatches: data.totalMatches || 0 })
  }

  getMatches = async () => {
    const { accessToken, userId: propUserId } = this.props;
    const userId = propUserId || sessionStorage.getItem('userId');
    const filter = this.state.filter;
    this.setState({ isFetching: true });

    try {
      const matches = await getMatches({ accessToken, userId, filter });
      this.setState({ matches, isFetching: false });
    } catch (error) {
      this.setState({ isFetching: false });
      console.log(error);
    }
  };

  syncMatches = async () => {
    const { accessToken } = this.props;
    this.setState({ isFetching: true });
    try {
      await syncMatches({ accessToken });
      const { data } = await getMetaData({ totalMatches: true });
      console.log('totalMatches: ', data.totalMatches);
      this.setState({ totalMatches: Number(data.totalMatches), isFetching: false });

    } catch (e) {
      this.setState({ isFetching: false });
      console.log(e);
    }
  }

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
      totalMatches,
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
          <span>Matchningar: </span><div>{totalMatches} </div>
          <button disabled={isFetching} onClick={this.syncMatches}>{isFetching ? 'Synkar...' : 'Synka fler matchningar'}</button>
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

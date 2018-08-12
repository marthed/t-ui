import React from 'react';
//import FilterOption from './filterOption';
import './filterContainer.css';
import PropTypes from 'prop-types';


export default class FilterContainer extends React.Component {

  state = {
    isOpen: false,
    maxDistance: 1
  };

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  cleanFilters = () => {
    const { setFilters } = this.props;
    setFilters(null);
    this.setState({isOpen: false, maxDistance: 1});
  }

  handleChange = (evt) => {
    this.setState({maxDistance: evt.target.value })
  }

  updateFilters = () => {
    this.props.setFilter({ ...this.state.filters });
    this.props.getMatches();
    this.setState({ isOpen: false });
  }

  renderClosedContainer = () => {
    const { filters } = this.props;
    return (
    <div className="filter-container-closed">
      {filters &&
      <div className="filter-container-closed__selected-filter">
        Max distans: {filters.distance_mi}
      </div>
      }
    </div>
    )
  };

  renderOpenContainer = () => {
    const { isFetching } = this.props;
    return (
      <div className="filter-container-open">
          <div className="button-container" >
            <button onClick={this.updateFilters} disabled={isFetching}>
              Använd filter
            </button>
            <button onClick={this.cleanFilters} disabled={isFetching}>
              Rensa filter
            </button>
          </div>
      </div>
    )
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div className="filter-container">
        <div
          className="filter-container__toggle-button"
          onClick={this.toggleOpen}
          >
        </div>
        {isOpen ? this.renderOpenContainer() : this.renderClosedContainer()}
      </div>
    )
  }
}

FilterContainer.propTypes = {
  getMatches: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  filter: PropTypes.shape({}).isRequired,
}
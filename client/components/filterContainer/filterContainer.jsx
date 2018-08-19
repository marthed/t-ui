import React from 'react';
import RangeFilter from './rangeFilter.jsx';
import './filterContainer.css';
import PropTypes from 'prop-types';


export default class FilterContainer extends React.Component {

  state = {
    isOpen: false,
    tempFilter: {},
  };


  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  clearFilters = () => {
    this.props.setFilter(null);
    this.props.getMatches();
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
      </div>
      }
    </div>
    )
  };

  setTempFilter = type => filter => this.setState({ tempFilter: { [type]: filter }});

  renderFilterOptions = () => (
    <div className="filter-container__filter-options">
      <RangeFilter
        label="Avstånd"
        setFilter={this.setTempFilter('distance')}
        />
    </div>
  );

  renderOpenContainer = () => {
    const { isFetching } = this.props;
    return (
      <div className="filter-container-open">
        {this.renderFilterOptions()}
        <div className="button-container" >
          <button onClick={this.updateFilters} disabled={isFetching}>
            Använd filter
          </button>
          <button onClick={this.clearFilters} disabled={isFetching}>
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
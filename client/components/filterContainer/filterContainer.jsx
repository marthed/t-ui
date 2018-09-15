import React from 'react';
import RangeFilter from './filters/rangeFilter.jsx';
import './filterContainer.css';
import PropTypes from 'prop-types';


export default class FilterContainer extends React.Component {

  state = {
    isOpen: false,
    tempFilter: {},
  };


  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  clearFilters = () => {
    this.setState({ tempFilter: {}});
    this.props.setFilter({});
  }

  updateFilters = () => {
    console.log(this.state.tempFilter);
    this.props.setFilter(this.state.tempFilter);
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

  setTempFilter = type => filter => {
    const { tempFilter } = this.state;
    const filterToUpdate = tempFilter[type] || {};
    const updatedFilter = { ...filterToUpdate, ...filter };
    this.setState({ tempFilter: { [type]: updatedFilter }});
  };

  renderFilterOptions = () => (
    <div className="filter-container-open__top">
      <RangeFilter
        label="Avstånd"
        setFilter={this.setTempFilter('distance')}
        filter={this.state.tempFilter.distance || this.props.filter.distance}
        />
    </div>
  );

  renderOpenContainer = () => {
    const { isFetching } = this.props;
    return (
      <div className="filter-container-open">
        {this.renderFilterOptions()}
        <div className="filter-container-open__bottom">
          <div className="button-container">
            <button onClick={this.updateFilters} disabled={isFetching}>
              Använd filter
            </button>
            <button onClick={this.clearFilters} disabled={isFetching}>
              Rensa filter
            </button>
          </div>
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
  isFetching: PropTypes.bool.isRequired,
  filter: PropTypes.shape({}).isRequired,
  setFilter: PropTypes.func.isRequired,
}
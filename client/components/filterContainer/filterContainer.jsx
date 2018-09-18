import React from 'react';
import RangeFilter from './filters/rangeFilter.jsx';
import './filterContainer.css';
import PropTypes from 'prop-types';
import { pipe, mapValues, curry, omitBy, isEmpty } from 'lodash/fp';


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
    const { filter } = this.props;
    const { tempFilter } = this.state;
    const newFilter = 
    pipe(
      curry(mapValues(filter => omitBy(subFilter => !subFilter, filter))),
      curry(omitBy)(isEmpty)
      )({...filter, ...tempFilter });
      
    this.props.setFilter(newFilter);
    this.setState({ isOpen: false, tempFilter: {} });
  }

  translateFilter = filterName => {
    switch (filterName) {
      case 'distance': return 'Avstånd';
      case 'birth_date': return 'Ålder';
      default: 'Blaa';
    };
  }

  filterToJsx = filter => {
    const { max, min } = filter;
    if (min && max) return `Mellan ${min} och ${max}`;
    if (!min && max) return `Upp till ${max}`;
    if (min && !max) return `Från och med ${min}`;
    return 'Blaa bla bla';
  }

  renderClosedContainer = () => {
    const { filter } = this.props;
    const selectedFilter = Object
      .keys(filter)
      .map(f => (
      <div key={f} className="filter-container-closed__selected-filter">
        {`${this.translateFilter(f)}: ${this.filterToJsx(filter[f])}`}
      </div>));
    return (
      <div className="filter-container-closed">
        {selectedFilter}
      </div>
    );
  };

  setTempFilter = type => filter => {
    const { tempFilter } = this.state;
    const filterToUpdate = tempFilter[type] || {};
    const updatedFilter = { ...filterToUpdate, ...filter };
    this.setState({ tempFilter: { ...tempFilter, [type]: updatedFilter }});
  };

  renderFilterOptions = () => (
    <div className="filter-container-open__top">
      <RangeFilter
        label="Avstånd"
        setFilter={this.setTempFilter('distance')}
        filter={{...this.props.filter.distance, ...this.state.tempFilter.distance }}
        />
      <RangeFilter
        label="Ålder"
        setFilter={this.setTempFilter('birth_date')}
        filter={{...this.props.filter.birth_date, ...this.state.tempFilter.birth_date}}
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
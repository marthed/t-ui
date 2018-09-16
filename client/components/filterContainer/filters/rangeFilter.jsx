import React from 'react';
import './filter.css';
export default class RangeFilter extends React.Component {

  setMinValue = ({ target: { value }}) => {
    const minValue = parseInt(value);
    this.props.setFilter({ min: minValue });
  }

  setMaxValue = ({ target: { value }}) => {
    const maxValue = parseInt(value);
    this.props.setFilter({ max: maxValue });
  }

  render () {
    const { label, filter={} } = this.props;
    return (
      <div className="filter-option">
        <label>
          {label}
        </label>
        <input
          type="number"
          value={filter.min || ''}
          onChange={this.setMinValue}
          />
        <input
          type="number"
          value={filter.max || ''}
          onChange={this.setMaxValue}
          />
      </div>
    );
  }
}
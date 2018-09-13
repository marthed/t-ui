import React from 'react';
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
          min={0}
          max={filter.max || 1000}
          value={filter.min || 0}
          onChange={this.setMinValue}
          />
        <input
          type="number"
          min={filter.min || 0}
          max={1000}
          value={filter.max || 1000}
          onChange={this.setMaxValue}
          />
      </div>
    );
  }
}
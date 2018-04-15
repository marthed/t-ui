import React from 'react';

export default class FilterOption extends React.Component {
  render () {
    const { minValue, onChange, label } = this.props;
    return (
      <div className="filter-option">
        <label>
          {label}
        </label>
        <input
          type="number"
          name="min_dis"
          min="1"
          max={value}
          value={value}
          onChange={onChange}
          />
        <input
          type="number"
          name="max_dis"
          min={value}
          max="500"
          value={value}
          onChange={this.handleChange}
          />
      </div>
    );
  }
}
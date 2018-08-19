import React from 'react';

export default class RangeFilter extends React.Component {

  onChange = (evt) => {
    console.log(evt.target.value);
  };

  render () {
    const { label, filter } = this.props;
    return (
      <div className="filter-option">
        <label>
          {label}
        </label>
        <input
          type="number"
          name="min_dis"
          min="1"
          //max={value}
          //value={value}
          onChange={this.onChange}
          />
        <input
          type="number"
          name="max_dis"
          //min={value}
          max="500"
          //value={value}
          onChange={this.onChange}
          />
      </div>
    );
  }
}
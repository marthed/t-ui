import React from 'react';

function submitFilter(hej) {
  console.log(hej);
}

export default class FilterContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      isOpen: false,
      maxDistance: 1
    }
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  renderClosedContainer = () => {
    return (
    <div className="filter-container-closed"></div>
    )
  };

  handleChange = (evt) => {
    this.setState({maxDistance: evt.target.value })
  }

  updateFilters = () => {
    const { maxDistance } = this.state;
    const { setFilters } = this.props;
    setFilters({
      distance_mi: maxDistance
    });
    this.setState({ isOpen: false });
  }

  renderOpenContainer = () => {
    const { isFetching } = this.props;
    return (
      <div className="filter-container-open">
          <label>
            Max distans 
          </label>
          <input
            type="number"
            name="max_dis"
            min="1"
            max="500"
            value={this.state.maxDistance}
            onChange={this.handleChange}
            />
          <div className="button-container" >
            <button onClick={this.updateFilters} disabled={isFetching}>
              {isFetching ? "Hämtar matchingar..." : "Använd filter"}
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
import React from "react";
import PropTypes from "prop-types";
import "./matchModal.css";

export default class MatchModal extends React.Component {

  setModalRef = ref => {
    this.modalRef = ref;
  }

  componentDidMount() {
    document.addEventListener("click", this.onOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onOutsideClick);
  }

  onOutsideClick = ({ target }) => {
    if (!this.modalRef.contains(target)) {
      this.props.onOutsideClick();
    }
  };

  render() {
    return (
      <div className="match-modal">
        <div ref={this.setModalRef} className="match-modal-content">
        {this.props.selectedMatch}</div>
      </div>
    );
  }
}

MatchModal.propTypes = {
  selectedMatch: PropTypes.string.isRequired,
  onOutsideClick: PropTypes.func.isRequired
};

import React from 'react';
import PropTypes from 'prop-types';
import './matchModal.css';

export default class MatchModal extends React.Component {

  setModalRef = ref => {
    this.modalRef = ref;
  }

  componentDidMount() {
    document.addEventListener('click', this.onOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  onOutsideClick = ({ target }) => {
    if (!this.modalRef.contains(target)) {
      this.props.onOutsideClick();
    }
  };

  render() {
    const { person } = this.props.selectedMatch;
    return (
      <div className="match-modal">
        <div ref={this.setModalRef} className="match-modal-content__media-slider-wrapper">
          <div className="match-modal-content__media-slider" >
            {[].concat(person.photos).map(photo => {
              const photoUrl = photo.processedFiles[0].url;
              return <img key={photo.id} src={photoUrl}/>
            })}
          </div>
        </div>
        {/* <div ref={this.setModalRef} className="match-modal-content">
        </div> */}
      </div>
    );
  }
}

MatchModal.propTypes = {
  selectedMatch: PropTypes.shape({
    person: PropTypes.shape({
      photos: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string})),
      name: PropTypes.string.isRequired,
      distance_mi: PropTypes.number,
      jobs: PropTypes.arrayOf({}),
      schools: PropTypes.arrayOf({ name: PropTypes.string }),
      bio: PropTypes.string,
    }).isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onOutsideClick: PropTypes.func.isRequired,
};

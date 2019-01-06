import React from 'react';
import PropTypes from 'prop-types';
import './matchModal.css';
import { getMatchFromId } from './../../utils/webAPI';
import { get } from 'lodash/fp';

export default class MatchModal extends React.Component {

  setModalRef = ref => {
    this.modalRef = ref;
  }

  async componentDidMount() {
    document.addEventListener('click', this.onOutsideClick);
    // FETCH MESSAGES
    const id = get('id', this.props.selectedMatch);
    console.log('id: ', id);
    await getMatchFromId(id)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  onOutsideClick = ({ target }) => {
    if (!this.modalRef.contains(target)) {
      this.props.onOutsideClick();
    }
  };
  
  // {[].concat(person.photos).map(photo => {
  //   const photoUrl = photo.processedFiles[0].url;
  //   return <img key={photo.id} src={photoUrl}/>
  // })}

  render() {
    const { person } = this.props.selectedMatch;
    return (
      <div className="match-modal">
        <div ref={this.setModalRef} className="match-modal__container">
          <div className="match-modal__media">
            <img src={person.photos[0].processedFiles[1].url} />
          </div>
          <div className="match-modal__messages">
            Temp Messages
          </div>
          <div className="match-modal__person">
            Temp Match Data
          </div>
        </div>
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

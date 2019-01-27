import React from 'react';
import PropTypes from 'prop-types';
import './matchModal.css';
import { getMessagesFromMatch } from './../../utils/webAPI';
import { get } from 'lodash/fp';

export default class MatchModal extends React.Component {
  state = {
    messages: [],
  };

  setModalRef = ref => {
    this.modalRef = ref;
  };

  async componentDidMount() {
    document.addEventListener('click', this.onOutsideClick);
    // FETCH MESSAGES
    const id = get('id', this.props.selectedMatch);
    console.log('id: ', id);
    try {
      const { messages } = await getMessagesFromMatch(id);
      this.setState({ messages });
    } catch (e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  onOutsideClick = ({ target }) => {
    if (!this.modalRef.contains(target)) {
      this.props.onOutsideClick();
    }
  };

  renderMessages = () => {
    const { person } = this.props.selectedMatch;
    console.log('selectedMatch: ', this.props.selectedMatch);
    const { messages } = this.state;
    console.log('messages: ', messages);
    return messages.map(message => {
      const isMe = message.from !== person._id;
      return <div key={message._id} className={`match-modal__message--${isMe ? 'me' : 'match'}`}>{message.message}</div>;
    });
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
          <div className="match-modal__messages">{this.renderMessages()}</div>
          <div className="match-modal__person">Temp Match Data</div>
        </div>
      </div>
    );
  }
}

MatchModal.propTypes = {
  selectedMatch: PropTypes.shape({
    person: PropTypes.shape({
      photos: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string })),
      name: PropTypes.string.isRequired,
      distance_mi: PropTypes.number,
      jobs: PropTypes.arrayOf({}),
      schools: PropTypes.arrayOf({ name: PropTypes.string }),
      bio: PropTypes.string,
    }).isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onOutsideClick: PropTypes.func.isRequired,
};

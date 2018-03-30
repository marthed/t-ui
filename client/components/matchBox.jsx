import React from 'react';


export default class MatchBox extends React.Component {

  renderBirthDate = (birthDate) => {
    if (!birthDate) return '';
    return birthDate.split('T')[0];
  }

  render() {
    const { match } = this.props;

    return (
      <div className="match-box">
        <span>
          <img src={match.person.photos[0].url} height="150"/>
          <div>{match.person.name}</div>
          <div>{this.renderBirthDate(match.person.birth_date)}</div>
        </span>
        <span>{match.person.bio}</span>
      </div>
      )
  }
 
}
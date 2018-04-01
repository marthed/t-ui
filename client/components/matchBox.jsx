import React from 'react';


export default class MatchBox extends React.Component {

  renderBirthDate = (birthDate) => {
    if (!birthDate) return '';
    return birthDate.split('T')[0];
  }

  renderJobs = (jobs) => {
    if (!jobs || jobs.length === 0) return null;
    return jobs.map((job) => {
      const { title, company } = job;
      return (
      <span key={company ? company.name : title.name}>
        {title ? title.name : null}
        {company ? company.name : null}
      </span>)
    });
  }

  render() {
    const { match } = this.props;

    return (
      <div className="match-box">
        <span>
          <img src={match.person.photos[0].url} height="150"/>
          <div><b>{match.person.name}</b></div>
          <div>{this.renderBirthDate(match.person.birth_date)}</div>
          <div>Avstånd: {match.distance_mi} Km</div>
          <div>{this.renderJobs(match.jobs)}</div>
        </span>
        <br />
        <span>{match.person.bio}</span>
      </div>
      )
  }
 
}
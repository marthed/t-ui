import React from "react";
import PropTypes from "prop-types";

export default class MatchBox extends React.Component {
  
  renderBirthDate = birthDate => {
    if (!birthDate) return "";
    return birthDate.split("T")[0];
  };

  renderJobs = jobs => {
    if (!jobs || jobs.length === 0) return null;
    return jobs.map((job, idx) => {
      const { title, company } = job;
      return (
        <span key={company ? company.name + idx : title.name + idx}>
          {title ? title.name : null}
          {company ? company.name : null}
        </span>
      );
    });
  };

  renderSchools = schools => {
    if (!schools || schools.length === 0) return null;
    return schools.map((school, idx) => {
      const { name } = school;
      return <span key={name + idx}>{name}</span>;
    });
  };

  render() {
    const { match, onClick } = this.props;

    return (
      <div className="match-box" onClick={() => onClick(match._id)}>
        <span>
          <img src={match.photos[0].url} height="150" />
          <div>
            <b>{match.name}</b>
          </div>
          <div>{this.renderBirthDate(match.birth_date)}</div>
          <div>Avstånd: {match.distance_mi} Km</div>
          <div>{this.renderJobs(match.jobs)}</div>
          <div>{this.renderSchools(match.schools)}</div>
        </span>
        <br />
        <span>{match.bio}</span>
      </div>
    );
  }
}

MatchBox.propTypes = {
  match: PropTypes.shape({
    photos: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string})),
    name: PropTypes.string.isRequired,
    distance_mi: PropTypes.number.isRequired,
    jobs: PropTypes.arrayOf({}),
    schools: PropTypes.arrayOf({ name: PropTypes.string }),
    bio: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func
}

MatchBox.defaultProps = {
  onClick: () => {}
}
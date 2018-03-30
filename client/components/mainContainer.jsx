import React from 'react';


export default class MainContainer extends React.Component {

  getMatches = () => {
    console.log('HEEJ!');
  }

  render () {

    return (
    <div className="button-container">
      <button onClick={this.getMatches}>Get Matches</button>
    </div>
    )
  }
  
}

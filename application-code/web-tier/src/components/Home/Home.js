
    import React, {Component} from 'react';
    import architecture from '../../assets/3TierArch.png'

    class Home extends Component {
        render () {
        return (
            <div>
            <h1 style={{color:"white"}}>AWS 3-TIER Movie Catalog WEB APP</h1>
            <h2 style={{color:"white"}}>Team: Front of Class</h2>
            <img src={architecture} alt="3T Web App Architecture" style={{height:400,width:825}} />
          </div>
        );
      }
    }

    export default Home;
import React, {Component} from "react";
import { Link } from "react-router-dom";

class Home extends Component{
    render(){
        return(
            <div className="container">
                <br/>
                <h2> Hello Nauman Jaffar! </h2><br/>
                <h3>Please Enter the one time password you received in your email to get started</h3>
                <Link to="/survey" className="btn btn-primary" style={{ position: 'absolute', top: 0, right: 0, margin: '10px' }}>
                    Take me to Survey
                </Link>
            </div>
        )
    }
}
export default Home
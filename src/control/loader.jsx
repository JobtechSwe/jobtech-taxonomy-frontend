import React from 'react';
import Util from './util.jsx';

class Loader extends React.Component { 

    constructor() {
        super();
        this.css = "loader_group font";
    }

    render() {
        return (
            <div className={Util.getStyle(this)}>
                <div className="loader"/>
                <div>{this.props.text}</div>
            </div>
        );
    }
	
}

export default Loader;
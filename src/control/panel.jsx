import React from 'react';
import Util from './util.jsx';

class Panel extends React.Component { 

    constructor() {
        super();
        this.css = "panel";
    }

    render() {
        return (
            <div className={Util.getStyle(this)}>
                {this.props.children}
            </div>
        );
    }
	
}

export default Panel;
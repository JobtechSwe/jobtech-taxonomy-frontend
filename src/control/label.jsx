import React from 'react';
import Util from './util.jsx';

class Label extends React.Component { 

    constructor() {
        super();
        this.css = "label font";
    }

    render() {
        var title = this.props.hint == null ? "" : this.props.hint;
        return (
            <div 
                className={Util.getStyle(this)}
                title={title}>
                <div>{this.props.text}</div>
            </div>
        );
    }
	
}

export default Label;
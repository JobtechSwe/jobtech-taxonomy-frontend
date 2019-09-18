import React from 'react';
import Util from './util.jsx';

class Label extends React.Component { 

    constructor() {
        super();
        this.css = "label font hint_source";
    }

    render() {
        return (
            <div className={Util.getStyle(this)}>
                <div>{this.props.text}</div>
                {Util.renderHint(this)}
            </div>
        );
    }
	
}

export default Label;
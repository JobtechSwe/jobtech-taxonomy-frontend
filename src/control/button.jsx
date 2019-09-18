import React from 'react';
import Util from './util.jsx';

class Button extends React.Component { 
    
    constructor() {
        super();
        this.css = "button no_select font hint_source";
    }

    render() {
        return (
            <div 
                className={Util.getStyle(this)}
                onMouseUp={this.props.onClick}>
                <div>{this.props.text}</div>
                {Util.renderHint(this)}
            </div>
        );
    }
	
}

export default Button;
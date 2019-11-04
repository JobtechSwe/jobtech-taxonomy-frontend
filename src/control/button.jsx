import React from 'react';
import Util from './util.jsx';

class Button extends React.Component { 
    
    constructor() {
        super();
        this.css = "button no_select font hint_source";
    }

    render() {
        var isEnabled = this.props.isEnabled == null ? true : this.props.isEnabled;
        var css = Util.getStyle(this) + (isEnabled ? "" : " button_disabled");
        return (
            <div 
                className={css}
                onMouseUp={this.props.onClick}>
                <div>{this.props.text}</div>
                {Util.renderHint(this)}
            </div>
        );
    }
	
}

export default Button;
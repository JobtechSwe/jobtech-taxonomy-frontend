import React from 'react';
import Util from './util.jsx';

class Button extends React.Component { 
    
    constructor() {
        super();
        this.css = "button no_select font";
    }

    onClick() {
        var isEnabled = this.props.isEnabled == null ? true : this.props.isEnabled;
        if(isEnabled && this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        var isEnabled = this.props.isEnabled == null ? true : this.props.isEnabled;
        var css = Util.getStyle(this) + (isEnabled ? "" : " button_disabled");
        var title = this.props.hint == null ? "" : this.props.hint;
        return (
            <div 
                className={css}
                title={title}
                onMouseUp={this.onClick.bind(this)}>
                <div>{this.props.text}</div>
            </div>
        );
    }
	
}

export default Button;
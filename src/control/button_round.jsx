import React from 'react';
import Util from './util.jsx';

class ButtonRound extends React.Component {

    constructor() {
        super();
        this.css = "button button_round no_select font";
    }

    render() {
        var title = this.props.hint == null ? "" : this.props.hint;
        return (
            <div 
                className={Util.getStyle(this)}
                title={title}
                onMouseUp={this.props.onClick}>
                <div>{this.props.text}</div>                
            </div>
        );
    }
	
}

export default ButtonRound;
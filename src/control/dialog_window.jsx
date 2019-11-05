import React from 'react';
import Label from './label.jsx';

class DialogWindow extends React.Component { 

    render() {        
        return (
            <div className="dialog_window font">
                <Label text={this.props.title}/>
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
	
}

export default DialogWindow;
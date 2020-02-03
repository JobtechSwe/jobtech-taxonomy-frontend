import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptName extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
        };
        this.props.editContext.onSave = this.onSave.bind(this);
    }

    onSave() {
        
    }

    render() {
        return (
            <div className="">
            </div>
        );
    }
}

export default EditConceptName;
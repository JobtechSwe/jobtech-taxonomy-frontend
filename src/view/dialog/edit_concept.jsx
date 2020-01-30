import React from 'react';
import Button from './../../control/button.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConcept extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {;
        return (
            <div className="dialog_content">
            </div>
        );
    }
}

export default EditConcept;
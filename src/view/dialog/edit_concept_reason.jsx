import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptReason extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            isChanged: false,
        };
    }

    onValueChanged(e) {
        var isChanged = e.target.value.length > 0;
        if(isChanged != this.state.isChanged) {
            this.props.editContext.setEnableSave(isChanged);
		}
		this.props.editContext.message = e.target.value;
        this.setState({
			value: e.target.value,
			isChanged: isChanged,
		});
    }

    render() {
        return (
            <div className="edit_concept_value_group">
                <Label 
                    css="edit_concept_value_title"
                    text="Antekning"/>
                <textarea 
                    rows="10" 
                    className="rounded"
                    value={this.state.value}
                    onChange={this.onValueChanged.bind(this)}/>
            </div>
        );
    }
}

export default EditConceptReason;
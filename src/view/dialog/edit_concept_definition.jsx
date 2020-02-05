import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptDefinition extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.item.definition,
            isChanged: false,
        };
        this.props.editContext.onSave = this.onSave.bind(this);
    }

    onSave(userMessage, callback) {
        // TODO: handle userMessage
        var item = this.props.item;
        App.addSaveRequest();
        Rest.patchConcept(item.id, "&definition=" + this.state.value, () => {
            this.props.item.definition = this.state.value;
            App.removeSaveRequest();
            callback();
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades genomföra definitionsförändring");
            App.removeSaveRequest();
        });
    }

    onValueChanged(e) {
        var isChanged = e.target.value != this.props.item.definition;
        if(isChanged != this.state.isChanged) {
            this.props.editContext.setEnableSave(isChanged);
        }
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
                    text="Ange definition på begrepp"/>
                <textarea
                    rows="10" 
                    className="rounded"
                    value={this.state.value}
                    onChange={this.onValueChanged.bind(this)}/>
            </div>
        );
    }
}

export default EditConceptDefinition;
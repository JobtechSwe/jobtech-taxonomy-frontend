import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptName extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.item.preferredLabel,
            isChanged: false,
        };
        this.props.editContext.onSave = this.onSave.bind(this);
    }

    onSave(userMessage, callback) {
        // TODO: handle userMessage
        var item = this.props.item;
        App.addSaveRequest();
        Rest.patchConcept(item.id, "&preferred-label=" + this.state.value, () => {
            this.props.item.preferredLabel = this.state.value;
            App.removeSaveRequest();
            callback();
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades genomföra namnförändring");
            App.removeSaveRequest();
        });
    }

    onValueChanged(e) {
        var isChanged = e.target.value != this.props.item.preferredLabel;
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
                    text="Ange nytt namn på begrepp"/>
                <input
                    className="rounded"
                    value={this.state.value}
                    onChange={this.onValueChanged.bind(this)}/>
            </div>
        );
    }
}

export default EditConceptName;
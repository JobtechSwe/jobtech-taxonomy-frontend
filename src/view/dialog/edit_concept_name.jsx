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
            isNameInvalid: false,
        };
        this.props.editContext.onSave = this.onSave.bind(this);
    }

    onSave(message, callback) {
        var item = this.props.item;
        App.addSaveRequest();
        Rest.patchConcept(item.id, message, "&preferred-label=" + this.state.value.trim(), () => {
            this.props.item.preferredLabel = this.state.value.trim();
            App.removeSaveRequest();
            callback();
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades uppdatera namn");
            App.removeSaveRequest();
        });
    }

    onValueChanged(e) {
        var name = e.target.value.trim();
        var isChanged = name != this.props.item.preferredLabel;
        this.setState({
            value: e.target.value,
            isChanged: isChanged,
        });
        if(name.length > 0) {
            if(isChanged) {
                Rest.abort();
                Rest.getConceptByTypeAndName(this.props.item.type, name, (data) => {
                    this.setState({isNameInvalid: data.length != 0});
                    this.props.editContext.setEnableSave(data.length == 0);
                }, () => {
        
                }); 
            } else {
                this.props.editContext.setEnableSave(false);
            }
        }
    }

    renderErrorText() {
        if(this.state.isNameInvalid) {
            return (
                <div className="edit_concept_error_text font">
                    Namnet är upptaget, vänligen välj ett annat namn
                </div>
            );
        }
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
                {this.renderErrorText()}
            </div>
        );
    }
}

export default EditConceptName;
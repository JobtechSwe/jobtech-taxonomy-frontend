import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptDepricate extends React.Component { 

    constructor(props) {
		super(props);
        this.state = {
			defaultValue: this.props.item.deprecated != null ? this.props.item.deprecated : false,
            value: this.props.item.deprecated != null ? this.props.item.deprecated : false,
            isChanged: false,
        };
        this.props.editContext.onSave = this.onSave.bind(this);
    }

    onSave(message, quality, callback) {
        // TODO: handle message and quality
        var item = this.props.item;
        App.addSaveRequest();
        Rest.deleteConcept(item.id, () => {
            item.deprecated = true;
            App.removeSaveRequest();
            callback();
        }, () => {
            App.showError(Util.getHttpMessage(status) + " : Avaktualisering misslyckades");
            App.removeSaveRequest();
        });
    }

    onValueChanged(e) {
		var isChanged = e.target.checked != this.state.defaultValue;
        if(isChanged != this.state.isChanged) {
            this.props.editContext.setEnableSave(isChanged);
        }
        this.setState({
            value: e.target.checked,
            isChanged: isChanged,
        });
    }

	render() {
        return (
            <div className="edit_concept_value_group">
                <Label 
                    css="edit_concept_value_title"
                    text="Avaktualisera begrepp"/>
                <input
					type="checkbox"
                    disabled={this.state.defaultValue ? "disabled" : ""}
                    value={this.state.value}
                    onChange={this.onValueChanged.bind(this)}/>
            </div>
        );
    }
}

export default EditConceptDepricate;
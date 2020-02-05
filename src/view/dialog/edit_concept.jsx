import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Rest from './../../context/rest.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import EditConceptName from './edit_concept_name.jsx';
import EditConceptDefinition from './edit_concept_definition.jsx';
import EditConceptReason from './edit_concept_reason.jsx';

class EditConcept extends React.Component { 

    constructor(props) {
        super(props);
        // edit types
        this.EDIT_TYPE_NONE = "--";
        this.EDIT_TYPE_NAME = "name";
        this.EDIT_TYPE_DESCRIPTION = "description";
        this.EDIT_TYPE_REFERENCED_TO = "set_reference";
        this.EDIT_TYPE_DEPRICATE = "deprecate";
        this.EDIT_TYPE_ADD_RELATION = "add_connection";
        this.EDIT_TYPE_REMOVE_RELATION = "remove_connection";
        this.state = {
            type: this.EDIT_TYPE_NONE,
            isSaveEnabledEditState: false,
            isSaveEnabledReasonState: false,
        };
        // edit context
        this.editContext = {
            setEnableSave: (enabled) => { this.setState({isSaveEnabledEditState: enabled})},
            onSave: null,
        };
        // reason context
        this.reasonContext = {
            setEnableSave: (enabled) => { this.setState({isSaveEnabledReasonState: enabled})},
            onSave: null,
        };
    }

    onTypeSelected(e) {
        this.setState({type: e.target.value});
    }

    onCloseClicked() {
        Rest.abort();
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    onSaveClicked() {
        if(this.editContext.onSave) {
            EventDispatcher.fire(Constants.EVENT_SHOW_SAVE_INDICATOR);
            this.editContext.onSave(this.reasonContext.message, () => {
                this.props.onItemUpdated();
                EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
            });
        }
    }

    renderTypeSelection() {
        var renderOption = (value) => {
            return ( <option value={value}>{Localization.get(value)}</option> );
        };
        return (
            <select
                className="rounded"
                value={this.state.type}
                onChange={this.onTypeSelected.bind(this)}>
                <option value={this.EDIT_TYPE_NONE}>--</option>
                {renderOption(this.EDIT_TYPE_NAME)}
                {renderOption(this.EDIT_TYPE_DESCRIPTION)}
                {renderOption(this.EDIT_TYPE_REFERENCED_TO)}
                {renderOption(this.EDIT_TYPE_DEPRICATE)}
                {renderOption(this.EDIT_TYPE_ADD_RELATION)}
                {renderOption(this.EDIT_TYPE_REMOVE_RELATION)}
            </select>
        );
    }

    renderReason() {
        if(this.state.type != this.EDIT_TYPE_NONE) {
            return ( 
                <EditConceptReason editContext={this.reasonContext}/>
            );
        }
    }

    render() {
        var getEditPage = (type) => {
            if(type == this.EDIT_TYPE_NAME) {
                return ( <EditConceptName item={this.props.item} editContext={this.editContext}/> );
            } else if(type == this.EDIT_TYPE_DESCRIPTION) {
                return ( <EditConceptDefinition item={this.props.item} editContext={this.editContext}/> );
            }
            return null;
        };
        return (
            <div className="dialog_content edit_concept_dialog edit_concept_dialog_page">
                <div>
                    <div className="edit_concept_value_group">
                        <Label 
                            css="edit_concept_value_title"
                            text={Localization.get("edit_type")}/>
                        {this.renderTypeSelection()}
                    </div>
                    {getEditPage(this.state.type)}
                    {this.renderReason()}
                </div>
                <div className="dialog_content_buttons">
                    <Button
                        text={Localization.get("close")}
                        onClick={this.onCloseClicked.bind(this)}/>
                    <Button
                        isEnabled={this.state.isSaveEnabledEditState && this.state.isSaveEnabledReasonState}
                        text={Localization.get("save")}
                        onClick={this.onSaveClicked.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default EditConcept;
import React from 'react';
import Button from './../../control/button.jsx';
import DialogWindow from './../../control/dialog_window.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Rest from './../../context/rest.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import EditConceptName from './edit_concept_name.jsx';
import EditConceptDefinition from './edit_concept_definition.jsx';
import EditConceptDeprecate from './edit_concept_deprecate.jsx';
import EditConceptReason from './edit_concept_reason.jsx';
import EditConceptQuality from './edit_concept_quality.jsx';
import EditConceptAddRelation from './edit_concept_add_relation.jsx';
import EditConceptRemoveRelation from './edit_concept_remove_relation.jsx';
import EditConceptSetReference from './edit_concept_set_reference.jsx';
import EditConceptNewValue from './edit_concept_new_value.jsx';

class EditConcept extends React.Component { 

    constructor(props) {
        super(props);
        // edit types
        this.EDIT_TYPE_NONE = "--";
        this.EDIT_TYPE_NAME = "name";
        this.EDIT_TYPE_DESCRIPTION = "description";
        this.EDIT_TYPE_QUALITY = "quality_control";
        this.EDIT_TYPE_REFERENCED_TO = "set_reference";
        this.EDIT_TYPE_DEPRICATE = "deprecate";
        this.EDIT_TYPE_ADD_RELATION = "add_connection";
        this.EDIT_TYPE_REMOVE_RELATION = "remove_connection";
        this.EDIT_TYPE_NEW_VALUE = "new_value";
        this.EDIT_TYPE_ADD_COMMENT = "add_comment";
        this.state = {
            type: this.EDIT_TYPE_NONE,
            isSaveEnabledEditState: false,
            isSaveEnabledReasonState: false,
            showQloseQuery: false,
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

    saveManualDaynote(message, callback) {
        Rest.postDayNote(this.props.item.id, message, () => {
            App.removeSaveRequest();
            callback();
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades spara manuell daganteckning");
            App.removeSaveRequest();
        });
    }

    onTypeSelected(e) {
        this.setState({type: e.target.value});
    }

    onAbortClicked() {
        this.setState({showQloseQuery: false});
    }

    onCloseClicked(force) {
        if((this.state.isSaveEnabledEditState || this.state.isSaveEnabledReasonState) && !force) {
            this.setState({showQloseQuery: true});
        } else {
            Rest.abort();
            EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
        }
    }

    onSaveClicked() {
        if(this.editContext.onSave) {
            EventDispatcher.fire(Constants.EVENT_SHOW_SAVE_INDICATOR);
            this.editContext.onSave(this.reasonContext.message, () => {
                this.props.onItemUpdated();
                EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
            });
        } else if(this.state.type == this.EDIT_TYPE_ADD_COMMENT) {
            this.saveManualDaynote(this.reasonContext.message, () => {
                this.props.onItemUpdated();
                EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
            });
        }
    }

    isSaveEnabled() {
        if(this.state.type == this.EDIT_TYPE_ADD_COMMENT) {
            return this.state.isSaveEnabledReasonState;
        } else {
            return this.state.isSaveEnabledEditState && this.state.isSaveEnabledReasonState;
        }
    }

    renderTypeSelection() {
        var isDeprecated = this.props.item.deprecated != null ? this.props.item.deprecated : false;
        var options = [
            this.EDIT_TYPE_NAME,
            this.EDIT_TYPE_DESCRIPTION,
            this.EDIT_TYPE_QUALITY,
            this.EDIT_TYPE_ADD_RELATION,
            this.EDIT_TYPE_REMOVE_RELATION,
            isDeprecated ? this.EDIT_TYPE_REFERENCED_TO : this.EDIT_TYPE_DEPRICATE,
            this.EDIT_TYPE_NEW_VALUE,
            this.EDIT_TYPE_ADD_COMMENT,
        ];
        var itemType = this.props.item.type;
        if(itemType != Constants.CONCEPT_OCCUPATION_NAME && itemType != Constants.CONCEPT_SKILL) {
            options.splice(2, 1);
        }
        options = options.map((value, index) => {
            return ( 
                <option key={index} value={value}>
                    {Localization.get(value)}
                </option> 
            );
        });
        return (
            <select
                className="rounded"
                value={this.state.type}
                onChange={this.onTypeSelected.bind(this)}>
                <option value={this.EDIT_TYPE_NONE}>--</option>
                {options}
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

    renderCloseQuery() {
        if(this.state.showQloseQuery) {
            return (
                <div className="overlay_window">
                    <DialogWindow title={Localization.get("dialog_unsaved_changes")}>
                        <div className="dialog_content edit_concept_dialog_page">
                            <div className="dialog_content_buttons">
                            <Button
                                    text={Localization.get("abort")}
                                    onClick={this.onAbortClicked.bind(this)}/>
                                <Button
                                    text={Localization.get("close")}
                                    onClick={this.onCloseClicked.bind(this, true)}/>
                                <Button
                                    isEnabled={this.isSaveEnabled()}
                                    text={Localization.get("save")}
                                    onClick={this.onSaveClicked.bind(this)}/>
                            </div>
                        </div>
                    </DialogWindow>
                </div>
            );
        }
    }

    render() {
        var getEditPage = (type) => {
            if(type == this.EDIT_TYPE_NAME) {
                return ( <EditConceptName item={this.props.item} editContext={this.editContext}/> );
            } else if(type == this.EDIT_TYPE_DESCRIPTION) {
                return ( <EditConceptDefinition item={this.props.item} editContext={this.editContext}/> );
            } else if(type == this.EDIT_TYPE_QUALITY) {
                return ( <EditConceptQuality item={this.props.item} editContext={this.editContext}/> );
            } else if(type == this.EDIT_TYPE_DEPRICATE) {
                return ( <EditConceptDeprecate item={this.props.item} editContext={this.editContext}/> );
            } else if(type == this.EDIT_TYPE_ADD_RELATION) {
                return ( <EditConceptAddRelation item={this.props.item} editContext={this.editContext}/> );
            } else if(type == this.EDIT_TYPE_REMOVE_RELATION) {
                return ( <EditConceptRemoveRelation item={this.props.item} editContext={this.editContext}/> );
            } else if(type == this.EDIT_TYPE_REFERENCED_TO) {
                return ( <EditConceptSetReference item={this.props.item} editContext={this.editContext}/> );
            } else if(type == this.EDIT_TYPE_NEW_VALUE) {
                return ( <EditConceptNewValue item={this.props.item} editContext={this.editContext}/> );
            } else if(type == this.EDIT_TYPE_ADD_COMMENT) {
                null;
            }
            return null;
        };
        return (
            <div className="dialog_content edit_concept_dialog edit_concept_dialog_page">
                <div className="edit_concept_group_container">
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
                        isEnabled={this.isSaveEnabled()}
                        text={Localization.get("save")}
                        onClick={this.onSaveClicked.bind(this)}/>
                </div>
                {this.renderCloseQuery()}
            </div>            
        );
    }
}

export default EditConcept;
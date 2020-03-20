import React from 'react';
import Button from './../../control/button.jsx';
import DialogWindow from './../../control/dialog_window.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Rest from './../../context/rest.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import EditConceptReason from './edit_concept_reason.jsx';
import EditConceptQuality from './edit_concept_quality.jsx';
import EditConceptNewValue from './edit_concept_new_value.jsx';

class NewConcept extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            isSaveEnabledEditState: false,
            isSaveEnabledReasonState: false,
            isSaveEnabledQualityState: false,
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
                EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
            });
        }
    }

    isSaveEnabled() {
        return this.state.isSaveEnabledEditState && this.state.isSaveEnabledReasonState;
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
        return (
            <div className="dialog_content edit_concept_dialog edit_concept_dialog_page">
                <div>
                    <EditConceptNewValue editContext={this.editContext}/>
                    <EditConceptReason editContext={this.reasonContext}/>
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

export default NewConcept;
import React from 'react';
import Button from './../../control/button.jsx';
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
        // quality context
        this.qualityContext = {
            setEnableSave: (enabled) => { this.setState({isSaveEnabledQualityState: enabled})},
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
            this.editContext.onSave(this.reasonContext.message, this.qualityContext.quality, () => {
                EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
            });
        }
    }

    isSaveEnabled() {
        return this.state.isSaveEnabledEditState && this.state.isSaveEnabledReasonState;
    }

    render() {
        return (
            <div className="dialog_content edit_concept_dialog edit_concept_dialog_page">
                <div>
                    <EditConceptNewValue editContext={this.editContext}/>
                    <EditConceptQuality editContext={this.qualityContext}/>
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
            </div>
        );
    }
}

export default NewConcept;
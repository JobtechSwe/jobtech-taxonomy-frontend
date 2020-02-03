import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import EditConceptName from './edit_concept_name.jsx';

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
        // page index
        this.PAGE_SELECTION = 0;
        this.PAGE_EDIT = 1;
        this.state = {
            type: this.EDIT_TYPE_NONE,
            page: this.PAGE_SELECTION,
            isSaveEnabled: false,
        };
        // edit page context
        this.editContext = {
            setEnableSave: (enabled) => { this.setState({isSaveEnabled: enabled})},
            onSave: null,
        };
    }

    onTypeSelected(e) {
        this.setState({type: e.target.value});
    }

    onNextClicked() {
        this.setState({page: this.PAGE_EDIT});
    }

    onBackClicked() {
        this.setState({page: this.PAGE_SELECTION});
    }

    onCloseClicked() {

    }

    onSaveClicked() {
        if(this.editContext.onSave) {
            // TODO: handle result true / false
            this.editContext.onSave();
        }
    }

    renderPageSelection() {
        return (
            <div className="edit_concept_dialog_page">
                <div className="edit_concept_dialog_type_selection">
                    <Label text={Localization.get("edit_type")}/>
                    {this.renderTypeSelection()}
                </div>
                <div className="dialog_content_buttons">
                    <Button
                        text={Localization.get("close")}
                        onClick={this.onCloseClicked.bind(this)}/>
                    <Button
                        isEnabled={this.state.type != this.EDIT_TYPE_NONE}
                        text={Localization.get("next")}
                        onClick={this.onNextClicked.bind(this)}/>
                </div>
            </div>
        );
    }
    
    renderPageEdit() {
        var getEditPage = (type) => {
            if(type == this.EDIT_TYPE_NAME) {
                return (
                    <EditConceptName 
                        item={this.props.item}
                        editContext={this.editContext}/>
                );
            }
            return null;
        };
        return (
            <div className="edit_concept_dialog_page">
                <div>
                    {getEditPage(this.state.type)}
                </div>
                <div className="dialog_content_buttons">
                    <Button
                        text={Localization.get("close")}
                        onClick={this.onCloseClicked.bind(this)}/>
                    <Button
                        text={Localization.get("back")}
                        onClick={this.onBackClicked.bind(this)}/>
                    <Button
                        isEnabled={this.state.isSaveEnabled}
                        text={Localization.get("save")}
                        onClick={this.onSaveClicked.bind(this)}/>
                </div>
            </div>
        );
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

    render() {
        var page = this.state.page == this.PAGE_SELECTION ? this.renderPageSelection() : this.renderPageEdit();
        return (
            <div className="dialog_content edit_concept_dialog">
                {page}
            </div>
        );
    }
}

export default EditConcept;
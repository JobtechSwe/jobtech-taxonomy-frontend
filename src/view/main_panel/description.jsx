import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';
import Util from '../../context/util.jsx';
import Rest from '../../context/rest.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Localization from '../../context/localization.jsx';
import App from '../../context/app.jsx';

class Description extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            isLocked: true,
            preferredLabel: Util.getObjectValue(props.item, "preferredLabel", ""),
            definition: Util.getObjectValue(props.item, "definition", ""),
        };
    }

    componentDidMount() {
        this.init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.init(props);
    }

    init(props) {
        if(props.groupContext) {
            props.groupContext.onLockChanged = this.onGroupLockedChanged.bind(this);
        }
        this.setState({
            preferredLabel: Util.getObjectValue(props.item, "preferredLabel", ""),
            definition: Util.getObjectValue(props.item, "definition", ""),
        });
    }

    onGroupLockedChanged(isLocked) {
        this.setState({isLocked: isLocked});
    }

    onUndoLabel(value) {
        this.setState({preferredLabel: value});
    }

    onUndoDefinition(value) {
        this.setState({definition: value});
    }

    onSave(changes) {
        var args = "";
        for (var prop in changes) {
            args += "&" + prop + "=" + changes[prop]; 
        }
        App.addSaveRequest();
        Rest.patchConcept(this.props.item.id, args, (data) => {
            App.removeSaveRequest();
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : sparning misslyckades");
            App.removeSaveRequest();
        });
    }

    createEditRequest(id, value, undoCallback) {
        var request = App.createEditRequest(id);
        request.newValue = value;
        request.oldValue = this.state[id];
        request.objectId = this.props.item.id;
        request.groupId = "description";
        request.undoCallback = undoCallback;
        request.saveCallback = this.onSave.bind(this);
        return request;
    }

    onLabelChanged(e) {
        var request = this.createEditRequest("preferred-label", e.target.value, this.onUndoLabel.bind(this));
        request.text = Localization.get("name");
        App.addEditRequest(request);
        this.setState({preferredLabel: e.target.value});
    }

    onDefinitionChanged(e) {
        var request = this.createEditRequest("definition", e.target.value, this.onUndoDefinition.bind(this));
        request.text = Localization.get("description");
        App.addEditRequest(request);
        this.setState({definition: e.target.value});
    }

    onDeprecateClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("deprecate"),
            content: this.renderDeprecateDialog(),
        });
    }

    onDeprecateYesClicked() {
        Rest.deleteConcept(this.props.item.id, () => {
            this.props.item.deprecated = true;
            // reselect the item, so the gui is refreshed
            EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, this.props.item);
            EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
        }, () => {
            App.showError(Util.getHttpMessage(status) + " : Avaktualisering misslyckades");
            EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
        });
    }
    
    onDeprecateAbortClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    renderDeprecateDialog() {
        return (
            <div className="dialog_content">
                <div>
                    {Localization.get("dialog_deprecate")} "{this.state.preferredLabel}"?
                </div>
                <div className="dialog_content_buttons">
                    <Button 
                        text={Localization.get("yes")}
                        onClick={this.onDeprecateYesClicked.bind(this)}/>
                    <Button 
                        text={Localization.get("abort")}
                        onClick={this.onDeprecateAbortClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    renderSpecialValue(elements, key, text) {
        if(this.props.item[key]) {
            elements.push(
                <div 
                    className="description_special_value" 
                    key={key}>
                    <Label text={text}/>
                    <input 
                        type="text" 
                        className="rounded"
                        disabled="disabled"
                        value={this.props.item[key]}/>
                </div>
            );
        } 
    }

    renderNameAndMisc() {
        var elements = [];
        elements.push(
            <div key="name-key">
                <Label text={Localization.get("name")}/>
                <input 
                    type="text" 
                    className="rounded"
                    disabled={this.state.isLocked ? "disabled" : ""}
                    value={this.state.preferredLabel}
                    onChange={this.onLabelChanged.bind(this)}/>
            </div>
        );
        this.renderSpecialValue(elements, "ssyk-code-2012", "SSYK");
        this.renderSpecialValue(elements, "isco-code-08", "ISCO");
        this.renderSpecialValue(elements, "iso-3166-1-alpha-2-2013", "Kod"); // land
        this.renderSpecialValue(elements, "iso-3166-1-alpha-3-2013", Localization.get("name"));
        this.renderSpecialValue(elements, "driving-licence-code-2013", "Typ"); // körkort
        this.renderSpecialValue(elements, "eures-code-2014", "Typ"); // anställningsvaraktighet
        this.renderSpecialValue(elements, "iso-639-3-alpha-2-2007", "Kod"); // språk
        this.renderSpecialValue(elements, "iso-639-3-alpha-3-2007", Localization.get("name")); 
        this.renderSpecialValue(elements, "nuts-level-3-code-2013", "NUTS");  // eu region
        this.renderSpecialValue(elements, "sni-level-code-2007", "SNI"); 
        this.renderSpecialValue(elements, "sun-education-level-code-2020", "SUN"); 
        this.renderSpecialValue(elements, "sun-education-field-code-2020", "SUN"); 
        return (
            <div className="description_name_and_misc">
                {elements}
            </div>
        );
    }

    render() {
        return (
            <div className="description">
                {this.renderNameAndMisc()}
                <Label text={Localization.get("description")}/>
                <textarea 
                    rows="10" 
                    className="rounded"
                    disabled={this.state.isLocked ? "disabled" : ""}
                    value={this.state.definition}
                    onChange={this.onDefinitionChanged.bind(this)}/>
                <div>
                    <Button 
                        css="deprecate_button"
                        isEnabled={!this.state.isLocked}
                        text={Localization.get("deprecate")}
                        onClick={this.onDeprecateClicked.bind(this)}/>
                </div>
            </div>
        );
    }
	
}

export default Description;
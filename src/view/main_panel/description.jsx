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

    createEditRequest(id, value, undoCallback) {
        var request = App.createEditRequest(id);
        request.newValue = value;
        request.oldValue = this.state[id];
        request.objectId = this.props.item.id;
        request.undoCallback = undoCallback;
        return request;
    }

    onLabelChanged(e) {
        var request = this.createEditRequest("preferredLabel", e.target.value, this.onUndoLabel.bind(this));
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
            // TODO: notify error
            EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
        });
    }
    
    onDeprecateAbortClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    renderDeprecateDialog() {
        return (
            <div className="dialog_save">
                <div>
                    {Localization.get("dialog_deprecate")} "{this.state.preferredLabel}"?
                </div>
                <div className="dialog_save_buttons">
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

    render() {
        return (
            <div className="description">
                <Label text={Localization.get("name")}/>
                <input 
                    type="text" 
                    className="rounded"
                    disabled={this.state.isLocked ? "disabled" : ""}
                    value={this.state.preferredLabel}
                    onChange={this.onLabelChanged.bind(this)}/>
                <Label text={Localization.get("description")}/>
                <textarea 
                    rows="10" 
                    className="rounded"
                    disabled={this.state.isLocked ? "disabled" : ""}
                    value={this.state.definition}
                    onChange={this.onDefinitionChanged.bind(this)}/>
                <div>
                    <Button 
                        isEnabled={!this.state.isLocked}
                        text={Localization.get("deprecate")}
                        onClick={this.onDeprecateClicked.bind(this)}/>
                </div>
            </div>
        );
    }
	
}

export default Description;
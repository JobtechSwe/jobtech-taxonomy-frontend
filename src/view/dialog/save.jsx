import React from 'react';
import Button from './../../control/button.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class Save extends React.Component { 

    constructor(props) {
        super(props);
    }

    onSaveClicked() {
        App.commitEditRequests();
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    onDiscardClicked() {
        App.discardEditRequest();
        if(this.props.callback) {
            this.props.callback(Constants.DIALOG_OPTION_NO);
        }
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    render() {
        var changes = this.props.changes.map((element, index) => {
            return (
                <li key={index}>
                    {element.text}
                </li>
            );
        });
        return (
            <div className="dialog_save">
                <div>{Localization.get("dialog_unsaved_changes")}</div>
                <ul>{changes}</ul>
                <div className="dialog_save_buttons">
                    <Button 
                        onClick={this.onSaveClicked.bind(this)}
                        text={Localization.get("save")}/>
                    <Button 
                        onClick={this.onDiscardClicked.bind(this)}
                        text={Localization.get("ignore")}/>
                    <Button 
                        onClick={() => EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY)}
                        text={Localization.get("abort")}/>
                </div>
            </div>
        );
    }
}

export default Save;
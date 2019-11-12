import React from 'react';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Constants from './../../context/constants.jsx';
import App from './../../context/app.jsx';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import Localization from './../../context/localization.jsx';

class SavePanel extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            note: App.editNote,
        }
    }

    onCloseClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_SAVE_PANEL);
    }

    onSaveClicked() {
        App.commitEditRequests();
        EventDispatcher.fire(Constants.EVENT_HIDE_SAVE_PANEL);
    }

    onNoteChanged(e) {
        App.editNote = e.target.value;
        this.setState({note: e.target.value});
    }

    render() {
        return (
            <div className="save_panel">
                <Label text={Localization.get("change_note")}/>
                <textarea 
                    className="rounded"
                    value={this.state.note}
                    onChange={this.onNoteChanged.bind(this)}/>
                <div>
                    <Button 
                        onClick={this.onCloseClicked.bind(this)}
                        text={Localization.get("close")}/>
                    <Button 
                        onClick={this.onSaveClicked.bind(this)}
                        text={Localization.get("save")}/>
                </div>
            </div>
        );
    }
	
}

export default SavePanel;
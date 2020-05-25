import React from 'react';
import App from './../../context/app.jsx';
import Util from './../../context/util.jsx';
import Constants from './../../context/constants.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';

class NavBar extends React.Component { 

    constructor() {
        super();
        this.state = {
            selected: Util.getDefaultWorkMode(),
        };
        this.boundOnSetWorkMode = this.onSetWorkMode.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundOnSetWorkMode, Constants.ID_NAVBAR)
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundOnSetWorkMode);
    }

    setWorkmode(id) {
        EventDispatcher.fire(Constants.ID_SIDEPANEL_CONTAINER, id);
        EventDispatcher.fire(Constants.ID_MAINPANEL_CONTAINER, id);
        EventDispatcher.fire(Constants.EVENT_SET_WORKMODE, id);
        Util.setSearchUrlValue("tab", Constants.URL_MODE_SEARCHMAP[id]);
        this.setState({selected: id});
    }

    onSetWorkMode(mode) {
        this.setWorkmode(mode);
    }

    onSaveDialogResult(id, result) {
        if(result != Constants.DIALOG_OPTION_ABORT) {
            // user saved or discared changes and wants to continue
            this.setWorkmode(id);
        }
    }

    onButtonClicked(id) {
        if(App.hasUnsavedChanges()) {
            App.showSaveDialog(this.onSaveDialogResult.bind(this, id));
        } else {
            this.setWorkmode(id);
        }
    }

    renderButton(hint, icon, viewId) {
        var css = this.state.selected == viewId ? "selected" : "";
        return (
            <div
                className={css} 
                title={hint}
                onPointerUp={this.onButtonClicked.bind(this, viewId)}>
                <img src={icon}/>                
            </div>
        );
    }

    render() {
        return (
            <div className="side_nav_bar">
                {this.renderButton(Localization.get("value_storage"), Constants.ICON_TMP_1, Constants.WORK_MODE_1)}
                {this.renderButton(Localization.get("version"), Constants.ICON_TMP_2, Constants.WORK_MODE_2)}
                {this.renderButton(Localization.get("graph"), Constants.ICON_TMP_3, Constants.WORK_MODE_3)}
                {this.renderButton(Localization.get("tools"), Constants.ICON_TMP_4, Constants.WORK_MODE_4)}
                {this.renderButton(Localization.get("settings"), Constants.ICON_TMP_5, Constants.WORK_MODE_5)}
            </div>
        );
    }
	
}

export default NavBar;
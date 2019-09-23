import React from 'react';
import Hint from './../../control/hint.jsx';
import App from './../../context/app.jsx';
import Constants from './../../context/constants.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';

class NavBar extends React.Component { 

    constructor() {
        super();
        this.state = {
            selected: -1,
        };
    }

    setWorkmode(id) {
        EventDispatcher.fire(Constants.EVENT_SET_WORKMODE, id);
        this.setState({selected: id});
    }

    onSaveDialogResult(id, result) {
        if(result != Constants.DIALOG_OPTION_ABORT) {
            // used saved or discared changes and wants to continue
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
        var css = this.state.selected == viewId ? "hint_source selected" : "hint_source";
        return (
            <div
                className={css} 
                onPointerUp={this.onButtonClicked.bind(this, viewId)}>
                <img src={icon}/>
                <Hint text={hint}/>
            </div>
        );
    }

    render() {
        return (
            <div className="side_nav_bar">
                {this.renderButton("View 1", Constants.ICON_TMP_1, Constants.SIDEPANEL_VIEW_1)}
                {this.renderButton("View 2", Constants.ICON_TMP_2, Constants.SIDEPANEL_VIEW_2)}
                {this.renderButton("View 3", Constants.ICON_TMP_3, Constants.SIDEPANEL_VIEW_3)}
                {this.renderButton("View 4", Constants.ICON_TMP_4, Constants.SIDEPANEL_VIEW_4)}
                {this.renderButton("View 5", Constants.ICON_TMP_5, Constants.SIDEPANEL_VIEW_5)}
            </div>
        );
    }
	
}

export default NavBar;
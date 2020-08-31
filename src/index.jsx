import React from 'react';
import ReactDOM from 'react-dom';
import Support from './support.jsx';
import Settings from './context/settings.jsx';
import EventDispatcher from './context/event_dispatcher.jsx';
import Constants from './context/constants.jsx';
import Util from './context/util.jsx';
import Localization from './context/localization.jsx';
import DialogWindow from './control/dialog_window.jsx';
import Button from './control/button.jsx';
import Label from './control/label.jsx';
import SidePanel from './view/side_panel/side_panel.jsx';
import MainPanel from './view/main_panel/main_panel.jsx';
import Login from './login.jsx';

class Index extends React.Component { 

	constructor() {
        super();
        Support.init();
        Settings.load();
        // state
        this.state = {
            popupText: Localization.get("saving") + "...",
            overlay: null,
            errors: [],
            savedSearchResult: null,
        };
        // callbacks
        this.boundShowPopupIndicator = this.onShowPopup.bind(this);
        this.boundHidePopIndicator = this.onHidePopup.bind(this);
        this.boundShowSaveIndicator = this.onShowSaveIndicator.bind(this);
        this.boundHideSaveIndicator = this.onHideSaveIndicator.bind(this);
        this.boundShowOverlayWindow = this.onShowOverlayWindow.bind(this);
        this.boundHideOverlayWindow = this.onHideOverlayWindow.bind(this);
        this.boundAddError = this.onAddError.bind(this);
        this.boundSaveSearchResult = this.onSaveSearchResult.bind(this);
    }

    componentDidMount() {
        Util.initSearchUrl("default");
        EventDispatcher.add(this.boundShowPopupIndicator, Constants.EVENT_SHOW_POPUP_INDICATOR);
        EventDispatcher.add(this.boundHidePopIndicator, Constants.EVENT_HIDE_POPUP_INDICATOR);
        EventDispatcher.add(this.boundShowSaveIndicator, Constants.EVENT_SHOW_SAVE_INDICATOR);
        EventDispatcher.add(this.boundHideSaveIndicator, Constants.EVENT_HIDE_SAVE_INDICATOR);
        EventDispatcher.add(this.boundShowOverlayWindow, Constants.EVENT_SHOW_OVERLAY);
        EventDispatcher.add(this.boundHideOverlayWindow, Constants.EVENT_HIDE_OVERLAY);
        EventDispatcher.add(this.boundAddError, Constants.EVENT_SHOW_ERROR);
        EventDispatcher.add(this.boundSaveSearchResult, Constants.EVENT_SAVE_SEARCH_RESULT);
    }

    onSaveSearchResult(searchResult) {
        this.setState({savedSearchResult: searchResult});
    }

    onAddError(message) {
        var error = {
            message: message,
            active: true,
        };
        this.state.errors.push(error);
        this.setState({errors: this.state.errors});
        // set timeout to inactivate the element
        setTimeout(() => {
            error.active = false;
            this.setState({errors: this.state.errors});
            // set timeout check if we should clear the list
            setTimeout(() => {
                var keep = this.state.errors.find((x) => {
                    return x.active;
                }) != null;
                if(!keep) {
                    this.setState({errors: []});
                }
            }, 500);
        }, 10000);
    }

    onShowPopup(text) {
        var indicator = document.getElementById("save_indicator");
        indicator.classList.add("save_enter_margin");
        this.setState({popupText: text});
    }

    onHidePopup() {
        var indicator = document.getElementById("save_indicator");
        indicator.classList.remove("save_enter_margin");
    }

    onShowSaveIndicator() {
        this.onShowPopup(Localization.get("saving") + "...");
    }
    
    onHideSaveIndicator() {
        this.onHidePopup();
    }

    onShowOverlayWindow(data) {
        var container = document.getElementById("main_container");
        var window = document.getElementById("overlay_window");
        container.classList.add("overlay_effect");
        window.classList.add("overlay_window");
        this.setState({overlay: data});
    }

    onHideOverlayWindow() {
        var container = document.getElementById("main_container");
        var window = document.getElementById("overlay_window");
        container.classList.remove("overlay_effect");
        window.classList.remove("overlay_window");
        this.setState({overlay: null});
    }

    onVisitSearchResult() {
        EventDispatcher.fire(Constants.ID_NAVBAR, Constants.WORK_MODE_4);
        setTimeout(() => {
            EventDispatcher.fire(Constants.EVENT_SEACH_CHANGES, this.state.savedSearchResult);
            this.setState({savedSearchResult: null});
        }, 500);
    }

    onSetUserId(userId) {
        if(userId != null) {
            Constants.REST_API_KEY = userId;
            this.forceUpdate();
        }
    }


    renderSavedSearchResult() {        
        if(this.state.savedSearchResult) {
            return (
                <div 
                    className="app_saved_search_content"
                    title={Localization.get("visit_latest_search")}
                    onPointerUp={this.onVisitSearchResult.bind(this)}>
                    <img src={Constants.ICON_SEARCH}/>
                </div>
            );
        }
    }

    renderErrors() {
        if(this.state.errors.length) {
            var items = this.state.errors.map((element, i) => {
                return (
                    <div
                        className={element.active ? "" : "app_error_inactive"} 
                        key={i}>
                        {element.message}
                    </div>
                );
            });
            return (
                <div className="app_error_content">
                    <div className="app_error_list font">
                        {items}
                    </div>
                </div>
            );
        }
    }

    renderSaveIndicator() {
        return (
            <div className="save_indicator_content">
                <div
                    id="save_indicator" 
                    className="save_indicator font">
                    <div className="loader"/>
                    <div>
                        {this.state.popupText}
                    </div>
                </div>
            </div>
        );
    }

    renderOverlay() {
        if(this.state.overlay) {
            var data = this.state.overlay;
            return (
                <DialogWindow title={data.title}>
                    {data.content}
                </DialogWindow>
            );
        }
    }

    renderContent() {
        if(Constants.REST_API_KEY == null || Constants.REST_API_KEY === "") {
            return ( <Login onSetUserId={this.onSetUserId.bind(this)}/> );
        } else {
            return (
                <div 
                    className="root_container"
                    id="main_container">
                    <SidePanel/>
                    <MainPanel/>
                </div>
            );
        }
    }

    render() {        
        return (
            <div className="main">
                {this.renderContent()}
                {this.renderSavedSearchResult()}
                {this.renderErrors()}
                <div id="overlay_window">
                    {this.renderOverlay()}
                </div>
                {this.renderSaveIndicator()}
            </div>
        );
    }
	
}

ReactDOM.render(<Index/>, document.getElementById('content'));
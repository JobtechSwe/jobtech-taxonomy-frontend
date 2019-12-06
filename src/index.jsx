import React from 'react';
import ReactDOM from 'react-dom';
import Support from './support.jsx';
import Settings from './context/settings.jsx';
import EventDispatcher from './context/event_dispatcher.jsx';
import Constants from './context/constants.jsx';
import Util from './context/util.jsx';
import Localization from './context/localization.jsx';
import DialogWindow from './control/dialog_window.jsx';
import SidePanel from './view/side_panel/side_panel.jsx';
import MainPanel from './view/main_panel/main_panel.jsx';

class Index extends React.Component { 

	constructor() {
        super();
        Support.init();
        Settings.load();
        // state
        this.state = {
            overlay: null,
            errors: [],
        };
        // callbacks
        this.boundShowSaveIndicator = this.onShowSaveIndicator.bind(this);
        this.boundHideSaveIndicator = this.onHideSaveIndicator.bind(this);
        this.boundShowOverlayWindow = this.onShowOverlayWindow.bind(this);
        this.boundHideOverlayWindow = this.onHideOverlayWindow.bind(this);
        this.boundAddError = this.onAddError.bind(this);
    }

    componentDidMount() {
        Util.initSearchUrl("default");
        EventDispatcher.add(this.boundShowSaveIndicator, Constants.EVENT_SHOW_SAVE_INDICATOR);
        EventDispatcher.add(this.boundHideSaveIndicator, Constants.EVENT_HIDE_SAVE_INDICATOR);
        EventDispatcher.add(this.boundShowOverlayWindow, Constants.EVENT_SHOW_OVERLAY);
        EventDispatcher.add(this.boundHideOverlayWindow, Constants.EVENT_HIDE_OVERLAY);
        EventDispatcher.add(this.boundAddError, Constants.EVENT_SHOW_ERROR);
        /*EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: "Hello",
            content: <div>Content div right here</div>
        });*/
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

    onShowSaveIndicator() {
        var indicator = document.getElementById("save_indicator");
        indicator.classList.add("save_enter_margin");
    }
    
    onHideSaveIndicator() {
        var indicator = document.getElementById("save_indicator");
        indicator.classList.remove("save_enter_margin");
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
                        {Localization.get("saving") + "..."}
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

    render() {
        return (
            <div className="main">
                <div 
                    className="main_container"
                    id="main_container">
                    <SidePanel/>
                    <MainPanel/>
                </div>
                {this.renderErrors()}
                {this.renderSaveIndicator()}
                <div id="overlay_window">
                    {this.renderOverlay()}
                </div>
            </div>
        );
    }
	
}

ReactDOM.render(<Index/>, document.getElementById('content'));
import React from 'react';
import ReactDOM from 'react-dom';
import Support from './support.jsx';
import EventDispatcher from './context/event_dispatcher.jsx';
import Constants from './context/constants.jsx';
import DialogWindow from './control/dialog_window.jsx';
import SidePanel from './view/side_panel/side_panel.jsx';
import MainPanel from './view/main_panel/main_panel.jsx';

class Index extends React.Component { 

	constructor() {
        super();
        Support.init();
        // callbacks
        this.boundShowOverlayWindow = this.onShowOverlayWindow.bind(this);
        this.boundHideOverlayWindow = this.onHideOverlayWindow.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundShowOverlayWindow, Constants.EVENT_SHOW_OVERLAY);
        EventDispatcher.add(this.boundHideOverlayWindow, Constants.EVENT_HIDE_OVERLAY);
        /*EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: "Hello",
            content: <div>Content div right here</div>
        });*/
    }

    onShowOverlayWindow(data) {
        var container = document.getElementById("main_container");
        var window = document.getElementById("overlay_window");
        container.classList.add("overlay_effect");
        window.classList.add("overlay_window");
        ReactDOM.render(
            <DialogWindow title={data.title}>
                {data.content}
            </DialogWindow>, 
            window);
    }

    onHideOverlayWindow() {
        var container = document.getElementById("main_container");
        var window = document.getElementById("overlay_window");
        container.classList.remove("overlay_effect");
        window.classList.remove("overlay_window");
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
                <div id="overlay_window"/>
            </div>
        );
    }
	
}

ReactDOM.render(<Index/>, document.getElementById('content'));
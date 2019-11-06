import React from 'react';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Constants from './../../context/constants.jsx';
import App from './../../context/app.jsx';
import Button from './../../control/button.jsx';
import Localization from './../../context/localization.jsx';

class SavePanel extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
        this.boundShow = this.onShow.bind(this);
        this.boundHide = this.onHide.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundShow, Constants.EVENT_SHOW_SAVE_PANEL);
        EventDispatcher.add(this.boundHide, Constants.EVENT_HIDE_SAVE_PANEL);
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundShow);
        EventDispatcher.remove(this.boundHide);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({show: false});
    }

    onShow() {
        this.setState({show: true});
    }

    onHide() {
        this.setState({show: false});
    }

    onResetClicked() {
        App.undoEditRequests();
        this.onHide();
    }

    onSaveClicked() {
        App.commitEditRequests();
        this.onHide();
    }

    render() {
        var s = {
            display: this.state.show ? "" : "none"
        };
        return (
            <div
                style={s} 
                className="save_panel">
                <Button 
                    onClick={this.onResetClicked.bind(this)}
                    text={Localization.get("reset")}/>
                <Button 
                    onClick={this.onSaveClicked.bind(this)}
                    text={Localization.get("save")}/>
            </div>
        );
    }
	
}

export default SavePanel;
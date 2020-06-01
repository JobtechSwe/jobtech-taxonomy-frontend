import React from 'react';
import Button from './../../control/button.jsx';
import List from './../../control/list.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class Export extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            values: props.values ? props.values : [],
        }
    }

    onSaveExcelClicked() {
        var values = [];
        if(this.props.onSaveExcel) {
            EventDispatcher.fire(Constants.EVENT_SHOW_POPUP_INDICATOR, Localization.get("exporting") + "...");
            setTimeout(() => {
                this.props.onSaveExcel(values);
                EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
            }, 500);
        }
    }
    
    render() {
        return (
            <div className="dialog_content">
                <div className="dialog_content_buttons">
                    <Button 
                        isEnabled={this.props.onSaveExcel ? true : false}
                        onClick={this.onSaveExcelClicked.bind(this)}
                        text={Localization.get("yes")}/>
                    <Button 
                        onClick={() => EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY)}
                        text={Localization.get("no")}/>
                </div>
            </div>
        );
    }
}

export default Export;
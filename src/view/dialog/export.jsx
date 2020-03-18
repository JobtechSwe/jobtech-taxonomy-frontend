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

    getFinalValues() {
        return this.state.values.filter((x) => {
            return x.selected;
        });
    }

    onSelectedChanged(element, e) {
        element.selected = e.target.checked;
        this.forceUpdate();
    }

    onSavePdfClicked() {
        var values = this.getFinalValues();
        if(this.props.onSavePdf) {
            this.props.onSavePdf(values);
        }
    }

    onSaveExcelClicked() {
        var values = this.getFinalValues();
        if(this.props.onSaveExcel) {
            this.props.onSaveExcel(values);
        }
    }
    
    render() {
        var values = this.state.values.map((element, index) => {
            var selected = element.selected == null ? false : element.selected;
            return (
                <div key={index}>                    
                    <input 
                        id={"checkbox" + index}
                        type="checkbox" 
                        checked={selected} 
                        onChange={this.onSelectedChanged.bind(this, element)}/>
                    <label htmlFor={"checkbox" + index}>{element.text}</label>
                </div>
            );
        });
        return (
            <div className="dialog_content">
                <div>{Localization.get("export_headline")}</div>
                <List css="dialog_export_list">{values}</List>
                <div className="dialog_content_buttons">
                    <Button 
                        isEnabled={false}
                        onClick={this.onSavePdfClicked.bind(this)}
                        text={Localization.get("export_pdf")}/>
                    <Button 
                        onClick={this.onSaveExcelClicked.bind(this)}
                        text={Localization.get("export_excel")}/>
                    <Button 
                        onClick={() => EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY)}
                        text={Localization.get("close")}/>
                </div>
            </div>
        );
    }
}

export default Export;
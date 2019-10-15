import React from 'react';
import DatePicker from 'react-datepicker';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Label from '../../control/label.jsx';

class Content3 extends React.Component { 

    constructor() {
        super();
        this.state = {
            fromDate: new Date(),
            toDate: new Date(),
        }
    }

    getSelectedPeriod() {
        return {
            from: this.state.fromDate,
            to: this.state.toDate,
        };
    }

    setFromDate(date) {
        console.log(date);
        this.setState({fromDate: date}, () => {
            EventDispatcher.fire(Constants.EVENT_SIDEPANEL_TIME_PERIOD_SELECTED, this.getSelectedPeriod()); 
        });
    }

    setToDate(date) {
        console.log(date);
        this.setState({toDate: date}, () => {
            EventDispatcher.fire(Constants.EVENT_SIDEPANEL_TIME_PERIOD_SELECTED, this.getSelectedPeriod()); 
        });
    }

    render() {
        return (
            <div className="side_content_3">
                <div className="sub_panel">
                    <div>
                        <Label text={Localization.get("from")}/>
                        <DatePicker 
                            selected={this.state.fromDate} 
                            onChange={this.setFromDate.bind(this)}/>
                    </div>
                    <div>
                        <Label text={Localization.get("to")}/>
                        <DatePicker 
                            selected={this.state.toDate} 
                            onChange={this.setToDate.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
	
}

export default Content3;
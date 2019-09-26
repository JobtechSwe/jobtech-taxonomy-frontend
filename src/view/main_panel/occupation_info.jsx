import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';

class OccupationInfo extends React.Component { 

    constructor() {
        super();
     
        this.state = {
          
        };
    }

    renderTop() {
        return(
            <div className="occupation_info_top">
                <div>
                    <Label text="Yrkesgrupp"/>
                    <input 
                        type="text" 
                        value={this.props.item == null ? "" : this.props.item.preferredLabel}/>
                    <Label text="Senast ändrad:"/>
                </div>
                <div>
                    <Label text="Ansvarig"/>
                    <input type="text"/>
                </div>
                <div>
                    <Label text="Motsv. ISCO08"/>
                    <input type="text"/>
                </div>
            </div>
        );
    }

    renderBottom() {
        return(
            <div className="occupation_info_bottom">
                <Label text="Beskrivning"/>
                <textarea 
                    rows="10" 
                    value={this.props.item == null ? "" : this.props.item.definition}/>
            </div>
        );
    }

    render() {
        return (
            <div className="occupation_info">
                {this.renderTop()}
                {this.renderBottom()}
            </div>
        );
    }
	
}

export default OccupationInfo;
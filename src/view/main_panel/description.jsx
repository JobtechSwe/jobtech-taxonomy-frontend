import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';

class Description extends React.Component { 

    constructor() {
        super();
    }

    render() {
        return (
            <div className="description">
                <Label text={Localization.get("name")}/>
                <input 
                    type="text" 
                    className="rounded"
                    value={this.props.item == null ? "" : this.props.item.preferredLabel}/>
                <Label text={Localization.get("description")}/>
                <textarea 
                    rows="10" 
                    className="rounded"
                    value={this.props.item == null ? "" : this.props.item.definition}/>
            </div>
        );
    }
	
}

export default Description;
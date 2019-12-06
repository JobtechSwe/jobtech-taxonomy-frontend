import React from 'react';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import List from '../../control/list.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Settings from '../../context/settings.jsx';
import Util from '../../context/util.jsx';

class Content5 extends React.Component { 

    constructor() {
        super();
        this.state = {
            editableTypes: Settings.data.editableTypes,
        };
    }
   
    onEditableTypeChanged(type, e) {
        var types = this.state.editableTypes;
        if(e.target.checked) {
            types.push(type);
        } else {
            var index = types.indexOf(type);
            types.splice(index, 1);
        }
        this.setState({editableTypes: types}, () => {
            Settings.save();
        });
    }

    renderEditableTypes() {
        var list = JSON.parse(JSON.stringify(Constants.DB_TYPES));
        list.sort((a, b) => {
            var p1 = Localization.get("db_" + a);
            var p2 = Localization.get("db_" + b);
            if(p1 < p2) return -1;
            if(p1 > p2) return 1;
            return 0;
        });
        var types = list.map((type, index) => {
            return (
                <div 
                    key={index}>
                    <Label 
                        css="settings_editable_types_type"
                        text={Localization.get("db_" + type)}/>
                    <input 
                        type="checkbox"
                        onChange={this.onEditableTypeChanged.bind(this, type)}
                        checked={Settings.isEditable(type)}/>
                </div>
            );
        });
        return (
            <Group text={Localization.get("type_editable")}>
                <List css="settings_editable_types">
                    {types}
                </List>
            </Group>
        );
    }    

    render() {
        return (
            <div className="main_content_5">       
                <Label 
                    css="main_content_title" 
                    text={Localization.get("settings")}/>
                {this.renderEditableTypes()}
            </div>
        );
    }
	
}

export default Content5;
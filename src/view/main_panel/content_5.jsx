import React from 'react';
import Label from '../../control/label.jsx';
import Button from '../../control/button.jsx';
import Group from '../../control/group.jsx';
import List from '../../control/list.jsx';
import Constants from '../../context/constants.jsx';
import CacheManager from '../../context/cache_manager.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Settings from '../../context/settings.jsx';
import Util from '../../context/util.jsx';

class Content5 extends React.Component { 

    constructor() {
        super();
        this.state = {
            editableTypes: Settings.data.editableTypes,
            visibleTypes: Settings.data.visibleTypes,
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

    onVisibleTypeChanged(type, e) {
        var types = this.state.visibleTypes;
        if(e.target.checked) {
            types.push(type);
        } else {
            var index = types.indexOf(type);
            types.splice(index, 1);
        }
        this.setState({visibleTypes: types}, () => {
            Settings.save();
        });
    }

    onClearCacheClicked() {
        CacheManager.clear();
        this.forceUpdate();
    }

    onForgetUserIdClicked() {
        localStorage.removeItem("taxonomy_user");
        this.forceUpdate();
    }

    renderEditableTypes() {
        var list = JSON.parse(JSON.stringify(Constants.DB_TYPES));
        list.sort((a, b) => {
            var p1 = Localization.get(a === Constants.CONCEPT_SKILL_HEADLINE ? "skill_headline" : "db_" + a);
            var p2 = Localization.get(b === Constants.CONCEPT_SKILL_HEADLINE ? "skill_headline" : "db_" + b);
            if(p1 < p2) return -1;
            if(p1 > p2) return 1;
            return 0;
        });
        var types = list.map((type, index) => {
            return (
                <div 
                    key={index}>
                    <Label 
                        css="settings_types_type"
                        text={Localization.get(type === Constants.CONCEPT_SKILL_HEADLINE ? "skill_headline" : "db_" + type)}/>
                    <div className="settings_types_cb">
                    <input 
                        type="checkbox"                        
                        onChange={this.onVisibleTypeChanged.bind(this, type)}
                        checked={Settings.isVisible(type)}/>
                    </div>
                    <div className="settings_types_cb">
                    <input 
                        type="checkbox"                        
                        onChange={this.onEditableTypeChanged.bind(this, type)}
                        checked={Settings.isEditable(type)}/>
                    </div>
                </div>
            );
        });
        return (
            <Group text={Localization.get("types")}>
                <div className="settings_types_head">
                    <Label 
                        css="settings_types_type"
                        text={Localization.get("type")}/>
                    <Label 
                        css="settings_types_cb"
                        text={Localization.get("visible")}/>
                    <Label 
                        css="settings_types_cb"
                        text={Localization.get("editable")}/>
                </div>
                <List css="settings_types">
                    {types}
                </List>
            </Group>
        );
    }

    renderCache() {
        var size = CacheManager.getCacheSize() / 1024;
        return (
            <Group text={"Cache"}>
                <div className="settings_cache_group">
                    <Label text={Localization.get("size") + ": " + size.toFixed(2) + " KB"}/>
                    <Button 
                        text={Localization.get("clear")}
                        onClick={this.onClearCacheClicked.bind(this)} />
                </div>
            </Group>
        );
    }

    renderForgetUserId() {
        var userId = localStorage.getItem("taxonomy_user");
        if(!userId) {
            userId = "";
        }
        return (
            <Group text={Localization.get("user_id")}>
                <div className="settings_user_id">
                    <Label text={userId}/>
                    <Button
                        text={Localization.get("forget")}
                        onClick={this.onForgetUserIdClicked.bind(this)} />
                </div>
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
                {this.renderCache()}
                {this.renderForgetUserId()}
            </div>
        );
    }
	
}

export default Content5;
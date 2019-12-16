import React from 'react';
import ControlUtil from '../../control/util.jsx';
import Label from '../../control/label.jsx';
import Button from '../../control/button.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Settings from '../../context/settings.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import App from '../../context/app.jsx';
import SavePanel from './save_panel.jsx';
import Description from './description.jsx';
import Connections from './connections.jsx';
import ItemHistory from './item_history.jsx';
import Save from '../dialog/save.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.state = {
            isShowingSavePanel: false,
            item: null,
            components: [],
        };
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
        this.boundMainItemSelected = this.onMainItemSelected.bind(this);
        this.boundShowSave = this.onShowSave.bind(this);
        this.boundHideSave = this.onHideSave.bind(this);
        this.boundHideSavePanel = this.onHideSavePanel.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);
        EventDispatcher.add(this.boundMainItemSelected, Constants.EVENT_MAINPANEL_ITEM_SELECTED);
        EventDispatcher.add(this.boundShowSave, Constants.EVENT_SHOW_SAVE_BUTTON);
        EventDispatcher.add(this.boundHideSave, Constants.EVENT_HIDE_SAVE_BUTTON);
        EventDispatcher.add(this.boundHideSavePanel, Constants.EVENT_HIDE_SAVE_PANEL);
        this.onSideItemSelected();       
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
        EventDispatcher.remove(this.boundMainItemSelected);
        EventDispatcher.remove(this.boundShowSave);
        EventDispatcher.remove(this.boundHideSave);
        EventDispatcher.remove(this.boundHideSavePanel);
    }

    onShowSave() {
        this.forceUpdate();
    }

    onHideSave() {
        this.forceUpdate();
    }

    onHideSavePanel() {
        this.setState({isShowingSavePanel: false});
    }

    onTitleSaveClicked() {
        this.setState({isShowingSavePanel: true});
    }

    onTitleResetClicked() {
        // TODO: dialog?
        App.undoEditRequests();
        this.setState({isShowingSavePanel: false});
    }

    onSideItemSelected(item) {
        var components = [];
        var key = 0;
        if(item) {
            var isDeprecated = item.deprecated ? item.deprecated : false;
            var isEditable = Settings.isEditable(item.type);
            var css = item.type == Constants.CONCEPT_ISCO_LEVEL_4 ? "isco_color" : null;
            // add content for item
            var infoContext = ControlUtil.createGroupContext();
            var connectionsContext = ControlUtil.createGroupContext();
            components.push(
                <Group 
                    text="Info"
                    useLock={true && isEditable}
                    context={infoContext}
                    unlockable={!isDeprecated}
                    css = {css}
                    key={key++}>
                    <Description 
                        item={item}
                        groupContext={infoContext}/>
                </Group>
            );
            components.push(
                <Group 
                    text={Localization.get("connections")}
                    useLock={true && isEditable}
                    context={connectionsContext}
                    unlockable={!isDeprecated}
                    css = {css}
                    key={key++}>
                    <Connections 
                        item={item}
                        groupContext={connectionsContext}/>
                </Group>
            );
            components.push(
                <Group 
                    text={Localization.get("history")}
                    css = {css}
                    key={key++}>
                    <ItemHistory item={item}/>
                </Group>
            );
        }
        this.setState({
            isShowingSavePanel: false,
            item: item,
            components: components,
        });
    }

    onMainItemSelected(item) {
        this.onSideItemSelected(item);
    }

    renderTitle() {
        var item = this.state.item;
        if(item == null) {
            return (
                <Label 
                    css="main_content_title" 
                    text={Localization.get("value_storage")}/>
            );
        } else {
            var key = 0;
            var isDeprecated = item.deprecated ? item.deprecated : false;
            var components = [];
            if(App.hasUnsavedChanges()) {
                components.push(
                    <div 
                        key={key++}
                        className="main_content_title_save">
                        <Button 
                            onClick={this.onTitleResetClicked.bind(this)}
                            text={Localization.get("reset")}/>
                        <Button 
                            onClick={this.onTitleSaveClicked.bind(this)}
                            text={Localization.get("save")}/>
                    </div>
                );
                if(this.state.isShowingSavePanel) {
                    components.push(
                        <SavePanel key={key++}/>
                    );
                }
            } else {
                components.push(
                    <Label 
                        key={key++}
                        text={item.preferredLabel}/>
                );
                if(isDeprecated) {
                    components.push(
                        <Label 
                            key={key++}
                            css="main_content_title_deprecated" 
                            text={Localization.get("deprecated")}/>
                    );
                }
            }
            return (
                <div className="main_content_title_container">
                    <Label 
                        css="main_content_title" 
                        text={Localization.get("db_" + item.type)}/>
                    <div className="main_content_title_name">
                        {components}
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="main_content_1">
                {this.renderTitle()}             
                {this.state.components}
            </div>
        );
    }
	
}

export default Content1;
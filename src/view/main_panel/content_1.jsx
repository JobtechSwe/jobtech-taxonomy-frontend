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
import CacheManager from '../../context/cache_manager';
import SavePanel from './save_panel.jsx';
import Description from './description.jsx';
import Deprecated from './deprecated.jsx';
import Connections from './connections.jsx';
import ItemHistory from './item_history.jsx';
import Save from '../dialog/save.jsx';
import EditConcept from '../dialog/edit_concept.jsx';
import NewConcept from '../dialog/new_concept.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.state = {
            isShowingSavePanel: false,
            item: null,
            components: [],
        };
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
        this.boundShowSave = this.onShowSave.bind(this);
        this.boundHideSave = this.onHideSave.bind(this);
        this.boundHideSavePanel = this.onHideSavePanel.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);
        EventDispatcher.add(this.boundShowSave, Constants.EVENT_SHOW_SAVE_BUTTON);
        EventDispatcher.add(this.boundHideSave, Constants.EVENT_HIDE_SAVE_BUTTON);
        EventDispatcher.add(this.boundHideSavePanel, Constants.EVENT_HIDE_SAVE_PANEL);
        this.onSideItemSelected();       
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
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

    onItemSaved() {
        CacheManager.invalidateCachedRelations(this.state.item.id);
        CacheManager.updateTypeListItem(this.state.item);
        
        this.onSideItemSelected(this.state.item);
    }

    onNewConceptClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("new_value"),
            content: <NewConcept 
                        item={this.state.item}/>
        });
    }

    onEditClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("edit") + " " + this.state.item.preferredLabel,
            content: <EditConcept 
                        item={this.state.item}
                        onItemUpdated={this.onItemSaved.bind(this)}/>
        });
    }

    onSideItemSelected(item) {
        var components = [];
        var key = 0;
        if(item) {
            var deprecated = item.deprecated != null ? item.deprecated : false;
            var css = item.type == Constants.CONCEPT_ISCO_LEVEL_4 ? "isco_color" : null;

            /*
                    <Button
                        text={Localization.get("new_value")}
                        onClick={this.onNewConceptClicked.bind(this)}/>
            */
            components.push(
                <div 
                    className="main_content_1_buttons"
                    key={key++}>
                    <Button
                        text={Localization.get("edit")}
                        onClick={this.onEditClicked.bind(this)}/>
                </div>
            );

            if(deprecated) {
                components.push(
                    <Group 
                        text={Localization.get("referred_to")}
                        css={css}
                        key={key++}>
                        <Deprecated 
                            item={item}
                            groupContext={infoContext}/>
                    </Group>
                );
            }

            // add content for item
            var infoContext = ControlUtil.createGroupContext();
            var connectionsContext = ControlUtil.createGroupContext();
            components.push(
                <Group 
                    text="Info"
                    context={infoContext}
                    css={css}
                    key={key++}>
                    <Description 
                        item={item}
                        groupContext={infoContext}/>
                </Group>
            );
            components.push(
                <Group 
                    text={Localization.get("connections")}
                    context={connectionsContext}
                    css={css}
                    key={key++}>
                    <Connections 
                        item={item}
                        groupContext={connectionsContext}/>
                </Group>
            );
            components.push(
                <Group 
                    text={Localization.get("history")}
                    css={css}
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
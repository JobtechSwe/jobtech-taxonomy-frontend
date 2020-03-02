import React from 'react';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import VersionList from './version_list.jsx';
import ItemHistory from './item_history.jsx';

class Content2 extends React.Component { 

    constructor() {
        super();
        this.state = {
            selectedVersion: null,
            selectedItem: null,    
        };
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
        this.boundVersionItemSelected = this.onVersionItemSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);
        EventDispatcher.add(this.boundVersionItemSelected, Constants.EVENT_VERSION_ITEM_SELECTED);
        this.onSideItemSelected();
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
        EventDispatcher.remove(this.boundVersionItemSelected);
    }

    onSideItemSelected(item) {
        this.setState({selectedVersion: item});
    }

    onVersionItemSelected(item) {
        this.setState({selectedItem: item})
    }

    renderTitle() {
        var versionTitle = "";
        if(this.state.selectedVersion) {
            versionTitle = " - " + (this.state.selectedVersion.version == -1 ? Localization.get("not_published") : this.state.selectedVersion.version);
        }
        return (
            <Label 
                css="main_content_title" 
                text={Localization.get("version") + versionTitle}/>
        );
    }

    renderVersionList() {
        if(this.state.selectedVersion) {
            return (
                <Group 
                    css="version_list_group"
                    text={Localization.get("content")}>
                    <VersionList item={this.state.selectedVersion}/>
                </Group>
            );
        }
    }

    renderVersionItemHistory() {
        if(this.state.selectedItem) {
            return (
                <Group
                    css="version_list_group"
                    text={Localization.get("history")}>
                    <ItemHistory item={this.state.selectedItem["changed-concept"]}/>
                </Group>
            );
        }
    }
    
    render() {
        return (
            <div className="main_content_2">
                {this.renderTitle()}
                {this.renderVersionList()}
                {this.renderVersionItemHistory()}
            </div>
        );
    }
	
}

export default Content2;
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
            prevVersion: null,
            selectedItem: null,
            nrConcepts: 0,
            nrChanges: 0,    
        };
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
        this.boundVersionItemSelected = this.onVersionItemSelected.bind(this);
        this.boundVersionItemContentInfo = this.onVersionItemContentInfo.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);
        EventDispatcher.add(this.boundVersionItemSelected, Constants.EVENT_VERSION_ITEM_SELECTED);
        EventDispatcher.add(this.boundVersionItemContentInfo, Constants.EVENT_VERSION_ITEM_CONTENT_INFO);
        this.onSideItemSelected();
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
        EventDispatcher.remove(this.boundVersionItemSelected);
        EventDispatcher.remove(this.boundVersionItemContentInfo);
    }

    onVersionItemContentInfo(info) {
        this.setState({
            nrConcepts: info.nrConcepts,
            nrChanges: info.nrChanges,
        });
    }

    onSideItemSelected(item) {
        this.setState({
            selectedVersion: item == null ? null : item.selected,
            prevVersion: item == null ? null : item.prev,
            nrConcepts: 0,
            nrChanges: 0,
        });
    }

    onVersionItemSelected(item) {
        this.setState({selectedItem: item})
    }

    renderTitle() {
        var versionTitle = "";
        if(this.state.selectedVersion) {
            versionTitle = " - " + (this.state.selectedVersion.version == -1 ? Localization.get("not_published") : this.state.selectedVersion.version);
        }
        var concepts = this.state.nrConcepts > 0 ? this.state.nrConcepts + " " + Localization.get("concept") : "";
        var changes = this.state.nrChanges > 0 ? this.state.nrChanges + " " + Localization.get("changes") : "";
        return (
            <div className="main_content_title_container">
                <Label 
                    css="main_content_title" 
                    text={Localization.get("version") + versionTitle}/>
                <div className="main_content_title_name">
                    <Label text={changes}/>
                    <Label text={concepts}/>
                </div>
            </div>
        );
    }

    renderVersionList() {
        if(this.state.selectedVersion) {
            return (
                <Group                     
                    text={Localization.get("content")}>
                    <VersionList item={this.state.selectedVersion}/>
                </Group>
            );
        }
    }

    renderVersionItemHistory() {
        if(this.state.selectedItem) {
            var from = this.state.prevVersion == null ? null : this.state.prevVersion.date;
            var to = this.state.selectedVersion.date;
            return (
                <Group text={Localization.get("history")}>
                    <ItemHistory 
                        item={this.state.selectedItem["changed-concept"]}
                        from={from}
                        to={to}/>
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
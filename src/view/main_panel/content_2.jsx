import React from 'react';
import Button from '../../control/button.jsx';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import VersionList from './version_list.jsx';
import Util from '../../context/util.jsx';

class Content2 extends React.Component { 

    constructor() {
        super();
        this.state = {
            selectedVersion: null,
            prevVersion: null,
            nrConceptChanges: 0,
            nrRelationChanges: 0,    
        };
        this.exportContext = {onExport: null};
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
        this.boundVersionItemContentInfo = this.onVersionItemContentInfo.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);
        EventDispatcher.add(this.boundVersionItemContentInfo, Constants.EVENT_VERSION_ITEM_CONTENT_INFO);
        this.onSideItemSelected();
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
        EventDispatcher.remove(this.boundVersionItemContentInfo);
    }

    onVersionItemContentInfo(info) {
        this.setState({
            nrConceptChanges: info.nrConcepts,
            nrRelationChanges: info.nrRelations,
        });
    }

    onSideItemSelected(item) {
        this.setState({
            selectedVersion: item == null ? null : item.selected,
            prevVersion: item == null ? null : item.prev,
            nrConceptChanges: 0,
            nrRelationChanges: 0
        });
    }

    onExportClicked() {
        if(this.exportContext.onExport != null) {
            this.exportContext.onExport();
        }
    }

    renderTitle() {
        var versionTitle = "";
        if(this.state.selectedVersion) {
            versionTitle = " - " + (this.state.selectedVersion.version == -1 ? Localization.get("not_published") : this.state.selectedVersion.version);
        }
        var concepts = this.state.nrConceptChanges > 0 ? this.state.nrConceptChanges + " " + Localization.get("concept_changes") : "";
        var changes = this.state.nrRelationChanges > 0 ? this.state.nrRelationChanges + " " + Localization.get("relation_changes") : "";
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

    renderExportButton() {
        if(this.state.selectedVersion) {
            return (
                <div className="main_content_2_buttons">
                    <Button                             
                        onClick={this.onExportClicked.bind(this)}
                        text={Util.renderExportButtonText()}/>
                </div>
            );
        }
    }

    renderVersionList() {
        if(this.state.selectedVersion) {
            return (
                <Group                     
                    text={Localization.get("content")}>
                    <VersionList 
                        item={this.state.selectedVersion}
                        exportContext={this.exportContext}/>
                </Group>
            );
        }
    }
    
    render() {
        return (
            <div className="main_content_2">
                {this.renderTitle()}
                {this.renderExportButton()}
                {this.renderVersionList()}
            </div>
        );
    }
	
}

export default Content2;
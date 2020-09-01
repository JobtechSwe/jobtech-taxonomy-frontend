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
            nrFilteredConcepts: null,
            nrFilteredRelations: null,
        };
        this.onClickContext = {
                                onExport: null,
                                onPublishNewVersionClicked: null,
                            };
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
            nrFilteredConcepts: info.nrFilteredConcepts,
            nrFilteredRelations: info.nrFilteredRelations,
        });
    }

    onSideItemSelected(item) {
        this.setState({
            selectedVersion: item == null ? null : item.selected,
            prevVersion: item == null ? null : item.prev,
            nrConceptChanges: 0,
            nrRelationChanges: 0,
            nrFilteredConcepts: null,
            nrFilteredRelations: null,
        });
    }

    onPublishNewVersionClicked() {
        console.log(this.state.prevVersion);
        if(this.onClickContext.onPublishNewVersion != null && this.state.prevVersion) {
            this.onClickContext.onPublishNewVersion(this.state.prevVersion.version);
        }
    }

    onExportClicked() {
        if(this.onClickContext.onExport != null) {
            this.onClickContext.onExport();
        }
    }

    renderTitle() {
        var versionTitle = "";
        if(this.state.selectedVersion) {
            versionTitle = " - " + (this.state.selectedVersion.version == -1 ? Localization.get("not_published") : this.state.selectedVersion.version);
        }
        var concepts = "";
        if(this.state.nrConceptChanges > 0) {
            concepts = this.state.nrConceptChanges + " " + Localization.get("concept_changes");
            if(this.state.nrFilteredConcepts && this.state.nrFilteredConcepts < this.state.nrConceptChanges) {
                concepts = this.state.nrFilteredRelations + " of " + concepts
            }
        }
        var relations = "";
        if(this.state.nrRelationChanges > 0) {
            relations = this.state.nrRelationChanges + " " + Localization.get("relation_changes");
            if(this.state.nrFilteredRelations && this.state.nrFilteredRelations < this.state.nrRelationChanges) {
                relations = this.state.nrFilteredRelations + " of " + relations;
            }
        }

        return (
            <div className="main_content_title_container">
                <Label 
                    css="main_content_title" 
                    text={Localization.get("version") + versionTitle}/>
                <div className="main_content_title_name">
                    <Label text={relations}/>
                    <Label text={concepts}/>
                </div>
            </div>
        );
    }

    renderButtons() {
        return ( 
            <div className="main_content_2_buttons">
                {this.renderExportButton()}
                {this.renderPublishVersionButton()}
            </div>
        );
    }

    renderPublishVersionButton() {        
        if(this.state.selectedVersion && this.state.selectedVersion.version == -1) {
            return (
                <Button
                    onClick={this.onPublishNewVersionClicked.bind(this)}
                    text={Localization.get("new_version")}/>
            );
        }
    }

    renderExportButton() {
        if(this.state.selectedVersion) {
            return (
                <Button                             
                    onClick={this.onExportClicked.bind(this)}
                    text={Util.renderExportButtonText()}/>
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
                        onClickContext={this.onClickContext}/>
                </Group>
            );
        }
    }
    
    render() {
        return (
            <div className="main_content_2">
                {this.renderTitle()}
                {this.renderButtons()}
                {this.renderVersionList()}
            </div>
        );
    }
	
}

export default Content2;
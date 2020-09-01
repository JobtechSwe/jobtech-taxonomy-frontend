import React from 'react';
import Button from './../../control/button.jsx';
import App from './../../context/app.jsx';
import Label from './../../control/label.jsx';
import List from './../../control/list.jsx';
import Loader from './../../control/loader.jsx';
import SortArrow from './../../control/sort_arrow.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import Util from '../../context/util.jsx';

class PublishVersion extends React.Component { 

    constructor(props) {
        super(props);
        this.SORT_TYPE = "SORT_TYPE";
        this.SORT_NAME = "SORT_NAME";
        this.SORT_ERROR = "SORT_ERROR";
        this.PUBLISH_VERSION_LIST_EVENT_ID = "PUBLISH_VERSION_LIST_EVENT_ID";
        this.state = {            
            result: [],
            okToPublish: false,
            skills: null,
            occupationNames: null,
        }
        this.sortBy = this.SORT_TYPE;
        this.sortAsc = true;
    }

    componentDidMount() {
        this.afterVersion = this.props.afterVersion;
        this.versionTimestamp = this.props.versionTimestamp;
        //fetch data needed for check
        Rest.getOccupationNamesWithBroaderTypes((data) => {
            this.setState({occupationNames: data}, () => {this.performChecks()});            
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });
        
        Rest.getSkillsWithBroaderHedlinesRelatedSsyks((data) => {
            this.setState({skills: data}, () => {this.performChecks()});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });
    }

    hasEdge(id, edges) {
        return edges.find(e => e.source === id || e.target === id) != undefined;
    }

    checkConcepts(occupationNames, skills) {
        var result = [];
        //occupation to ssyk = 0
        //occupation to isco = 1
        for(var i=0; i<occupationNames.length; ++i) {
            var item = occupationNames[i];
            var ssyk = false;
            var isco = false;
            for(var j=0; j<item.broader.length; ++j) {
                if(Constants.CONCEPT_SSYK_LEVEL_4 === item.broader[j].type) {
                    ssyk = true;
                }                
                if(Constants.CONCEPT_ISCO_LEVEL_4 === item.broader[j].type) {
                    isco = true;
                }                
            }
            if(!ssyk) {
                result.push({
                    item: item,
                    error: 0,
                });
            }
            if(!isco) {
                result.push({
                    item: item,
                    error: 1,
                });
            }
        }
        //occupation to ssyk = 2
        //occupation to skillHeadline = 3
        for(var i=0; i<skills.length; ++i) {
            var item = skills[i];
            var ssyk = false;
            var headline = false;
            for(var j=0; j<item.related.length; ++j) {
                if(Constants.CONCEPT_SSYK_LEVEL_4 === item.related[j].type) {
                    ssyk = true;
                    break;
                }                
            }
            for(var j=0; j<item.broader.length; ++j) {
                if(Constants.CONCEPT_SKILL_HEADLINE === item.broader[j].type) {
                    headline = true;
                    break;
                }                
            }
            if(!ssyk) {
                result.push({
                    item: item,
                    error: 2,
                });
            }
            if(!headline) {
                result.push({
                    item: item,
                    error: 3,
                });
            }
        }
        return result;
    }

    performChecks() {
        if(this.doneFetchingData()) {
            var res = this.checkConcepts(this.state.occupationNames, this.state.skills);            
            this.setState({
                result: this.sortData(res),
                okToPublish: res.length == 0
            });            
        }
    }

    doneFetchingData() {
        return this.state.occupationNames && this.state.skills;
    }

    sortData(data) {       
        var cmp;
        switch(this.sortBy) {
            default:
            case this.SORT_TYPE:
                cmp = (a) => {return Localization.get("db_" + a.item.type);};
                break;
            case this.SORT_NAME:
                cmp = (a) => {return a.item.preferredLabel;};
                break;
            case this.SORT_ERROR:
                cmp = (a) => {return Localization.get("publish_error_" + a.error);};
                break;
        }
        return Util.sortByCmp(data, cmp, this.sortAsc);
    }

    onSortClicked(sortBy) {
        if(this.state.selected != null) {
            EventDispatcher.fire(this.PUBLISH_VERSION_LIST_EVENT_ID);
            this.onItemSelected(null);
        }      
        if(this.sortBy == sortBy) {
            this.sortAsc = !this.sortAsc;
        } else {
            this.sortBy = sortBy;
            this.sortAsc = true;
        }
        this.setState({ data: this.sortData(this.state.result) });
    }

    onItemSelected(item) {
        this.setState({
            selected: item,
        });        
    }

    onVisitClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
        EventDispatcher.fire(Constants.ID_NAVBAR, Constants.WORK_MODE_1);
        setTimeout(() => {
            EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, this.state.selected.item);
        }, 500);
    }

    onPublishClicked() {
        Rest.postNewVersion(this.afterVersion + 1, this.versionTimestamp, () => {
            EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades att skapa version");
        });
    }

    onCloseClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }
    
    renderItem(item) {
        return (
            <div className="dialog_publish_list_item">
                <div title={Localization.get("db_" + item.item.type)}>
                    {Localization.get("db_" + item.item.type)}
                </div>
                <div title={item.item.preferredLabel}>
                    {item.item.preferredLabel}
                </div>
                <div title={Localization.get("publish_error_" + item.error)}>
                    {Localization.get("publish_error_" + item.error)}
                </div>
            </div>
        );
    }

    renderTitle() {
        if(this.doneFetchingData()) {
            if(this.state.okToPublish) {
                return (
                    <Label css="main_content_title" text="Inga fel att åtgärda"/>
                );
            } else {
                return (
                    <Label css="main_content_title"text={this.state.result.length + " fel att åtgärda"}/>
                );
            }
        } else {
            return (
                <div>
                    <Loader/>
                </div>
            );
        }
    }

    renderResultHeader() {
        var renderArrow = (type) => {
            if(type == this.sortBy) {
                return (
                    <SortArrow css={this.sortAsc ? "down" : "up"}/>
                );
            }
        };
        if(this.state.result.length > 0) {
            return (
                <div className="dialog_publish_list_header no_select font">
                    <div onClick={this.onSortClicked.bind(this, this.SORT_TYPE)}>
                        {Localization.get("type")}
                        {renderArrow(this.SORT_TYPE)}
                    </div>
                    <div onClick={this.onSortClicked.bind(this, this.SORT_NAME)}>
                        {Localization.get("name")}
                        {renderArrow(this.SORT_NAME)}
                    </div>
                    <div onClick={this.onSortClicked.bind(this, this.SORT_ERROR)}>
                        {Localization.get("error")}
                        {renderArrow(this.SORT_ERROR)}
                    </div>
                </div>
            );
        }
    }

    renderResultList() {
        if(this.state.result.length > 0) {
            return (
                <List
                    eventId={this.PUBLISH_VERSION_LIST_EVENT_ID}
                    css="dialog_publish_list"                     
                    data={this.state.result} 
                    onItemSelected={this.onItemSelected.bind(this)}
                    dataRender={this.renderItem.bind(this)}/>
            );
        }
    }

    render() {        
        return(
            <div className="dialog_content dialog_publish_dialog">                
                {this.renderTitle()}
                {this.renderResultHeader()}
                {this.renderResultList()}
                <div className="dialog_publish_buttons">
                    <Button 
                        isEnabled={this.state.selected != null}
                        text={Localization.get("visit")}
                        onClick={this.onVisitClicked.bind(this)}/>
                    <Button 
                        isEnabled={this.state.okToPublish}
                        text={Localization.get("publish")}
                        onClick={this.onPublishClicked.bind(this)}/>
                    <Button 
                        text={Localization.get("close")}
                        onClick={this.onCloseClicked.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default PublishVersion;
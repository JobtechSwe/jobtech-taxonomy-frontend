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
            data: props.data,
            result: [],
            okToPublish: false,
            skills: null,
            occupationNames: null,
        }
        this.sortBy = this.SORT_TYPE;
        this.sortAsc = true;
    }

    componentDidMount() {
        //fetch data needed for check
        Rest.getConcepts("occupation-name",  (data) => {
            this.setState({occupationNames: data}, () => {this.performChecks()});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });
        Rest.getConcepts("skill",  (data) => {
            this.setState({skills: data}, () => {this.performChecks()});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });

        Rest.getGraph(Constants.RELATION_BROADER, "occupation-name", "ssyk-level-4", (data) => {
            this.setState({occupationToSsyk: data}, () => {this.performChecks()});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta relationer");
        });

        Rest.getGraph(Constants.RELATION_BROADER, "occupation-name", "isco-level-4", (data) => {
            this.setState({occupationToIsco: data}, () => {this.performChecks()});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta relationer");
        });

        Rest.getGraph(Constants.RELATION_BROADER, "skill", "skill-headline", (data) => {
            this.setState({skillToHeadline: data}, () => {this.performChecks()});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta relationer");
        });

        Rest.getGraph(Constants.RELATION_RELATED, "skill", "ssyk-level-4", (data) => {
            this.setState({skillToSsyk: data}, () => {this.performChecks()});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta relationer");
        });
    }

    hasEdge(id, edges) {
        return edges.find(e => e.source === id || e.target === id) != undefined;
    }

    checkConcepts(concepts, edges, checkNumber) {
        var result = [];
        for(var i=0; i<concepts.length; ++i) {
            var item = concepts[i];
            var isDeprecated = item.deprecated ? item.deprecated : false;
            if(!isDeprecated && !this.hasEdge(item.id, edges)) {
                result.push({
                    item: item,
                    error: checkNumber,
                });
            }
        }
        return result;
    }

    performChecks() {
        if(this.doneFetchingData()) {
            var res = [];
            res.push(...this.checkConcepts(this.state.occupationNames, this.state.occupationToSsyk.graph.edges, 0));
            res.push(...this.checkConcepts(this.state.occupationNames, this.state.occupationToIsco.graph.edges, 1));
            res.push(...this.checkConcepts(this.state.skills, this.state.skillToHeadline.graph.edges, 2));
            res.push(...this.checkConcepts(this.state.skills, this.state.skillToSsyk.graph.edges, 3));
            this.setState({
                result: this.sortData(res),
                okToPublish: res.length == 0
            });            
        }
    }

    doneFetchingData() {
        return this.state.occupationNames && 
                this.state.skills &&
                this.state.occupationToSsyk &&
                this.state.occupationToIsco &&
                this.state.skillToHeadline &&
                this.state.skillToSsyk;
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

    }

    onCloseClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }
    
    renderItem(item) {
        return (
            <div className="dialog_publish_list_item">
                <div>
                    {Localization.get("db_" + item.item.type)}
                </div>
                <div>
                    {item.item.preferredLabel}
                </div>
                <div>
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
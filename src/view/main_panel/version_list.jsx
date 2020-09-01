import React from 'react';
import Button from '../../control/button.jsx';
import Label from '../../control/label.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';
import SortArrow from '../../control/sort_arrow.jsx';
import Pager from '../../control/pager.jsx';
import Constants from '../../context/constants.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Util from '../../context/util.jsx';
import Excel from '../../context/excel.jsx';
import App from '../../context/app.jsx';
import Export from '../dialog/export.jsx';
import PublishVersion from '../dialog/publish_version.jsx';
import VersionDetail from './version_detail.jsx';

class VersionList extends React.Component { 

    constructor() {
        super();
        this.VERSION_LIST_EVENT_ID = "VERSION_LIST_EVENT_ID";
        this.SORT_EVENT_TYPE = 0;
        this.SORT_CONCEPT_TYPE = 1;
        this.SORT_CONCEPT_LABEL = 2;
        this.SORT__FROM = 3;
        this.SORT_TO = 4;
        this.SORT_RELATION_TYPE = 5;
        this.state = {
            item: null,
            data: [], 
            unfilteredData: [],
            filter: "",
            loadingData: false,
            selected: null,
            range: null,
            conceptChanges: 0,
            relationChanges: 0,
        }
        this.sortBy= this.SORT_EVENT_TYPE;
        this.sortDesc= false;
    }

    componentDidMount() {
        if(this.props.exportContext) {
            this.props.exportContext.onExport = this.onSaveClicked.bind(this);
        }
        this.getChanges(this.props.item);
    }

    UNSAFE_componentWillReceiveProps(props) {
        if(this.props.exportContext) {
            this.props.exportContext.onExport = this.onSaveClicked.bind(this);
        }
        if(this.state.item == null || this.state.item.version != props.item.version) {
            EventDispatcher.fire(this.VERSION_LIST_EVENT_ID);
            this.state.selected = null;
            this.getChanges(props.item);
        }
    }

    sortData(data) {
        var cmp;
        switch(this.sortBy) {
            default:
            case this.SORT_EVENT_TYPE:
                cmp = (a) => {return this.getEvent(a);};
                break;
            case this.SORT_CONCEPT_TYPE:
                cmp = (a) => {return this.getType(a);};
                break;
            case this.SORT_CONCEPT_LABEL:
                cmp = (a) => {return this.getName(a);};
                break;
            case this.SORT__FROM:
                cmp = (a) => {return this.getFrom(a);};
                break;
            case this.SORT_TO:
                cmp = (a) => {return this.getTo(a);};
                break;
            case this.SORT_RELATION_TYPE:
                cmp = (a) => {return a.relation ? a.relation["relation-type"] : "";};
                break;
        }
        return Util.sortByCmp(data, cmp, this.sortDesc);
    }

    filterData() {
        // check if empty
        if(/^\s*$/.test(this.state.filter)) {
            return this.state.unfilteredData;
        }
        var lowerCaseFilter = this.state.filter.toLowerCase();
        return this.state.unfilteredData.filter((e) => {
            return this.getType(e).toLowerCase().indexOf(lowerCaseFilter) >= 0||
                this.getEvent(e).toLowerCase().indexOf(lowerCaseFilter) >= 0 ||
                this.getName(e).toLowerCase().indexOf(lowerCaseFilter) >= 0 ||
                this.getFrom(e).toLowerCase().indexOf(lowerCaseFilter) >= 0 ||
                this.getTo(e).toLowerCase().indexOf(lowerCaseFilter) >= 0 ||
                this.getRelationType(e).toLowerCase().indexOf(lowerCaseFilter) >= 0 ||
                e.id != null && e.id.toLowerCase().indexOf(lowerCaseFilter) >= 0;
        });
    }

    getChanges(item) {        
        this.setState({
            data: [], 
            unfilteredData: [],
            loadingData: true,
            item: item,
            conceptChanges: 0,
            relationChanges: 0,
        }, () => {            
            if(item) {
                Rest.abort();
                if(item.version == -1) {
                    Rest.getUnpublishedConceptChanges(item.latestVersion, (data) => {
                        data = this.sortData(data);
                        this.setState({
                            unfilteredData: data,
                            data: data, 
                            loadingData: true,
                            conceptChanges: data.length,
                        }, () => {
                            Rest.getUnpublishedRelationChanges(item.latestVersion, (data) => {
                                var preparedData = this.state.unfilteredData;
                                preparedData.push(...data);
                                preparedData = this.sortData(preparedData);
                                if(this.state.selected != null) {
                                    EventDispatcher.fire(this.VERSION_LIST_EVENT_ID);
                                    this.onItemSelected(null);
                                }
                                this.setState({
                                    unfilteredData: preparedData,
                                    data: preparedData, 
                                    loadingData: false,
                                    relationChanges: data.length,
                                });
                                EventDispatcher.fire(Constants.EVENT_VERSION_ITEM_CONTENT_INFO, {
                                    nrConcepts: this.state.conceptChanges, 
                                    nrRelations: this.state.relationChanges,
                                });
                            }, (status) => {
                                App.showError(Util.getHttpMessage(status) + " : misslyckades att hämta förändringar");
                                this.setState({loadingData: false});
                            });
                        });
                    }, (status) => {
                        App.showError(Util.getHttpMessage(status) + " : misslyckades att hämta förändringar");
                        this.setState({loadingData: false});
                    });
                } else {
                    Rest.getConceptChanges(item.version - 1, item.version, (data) => {
                        var data = this.sortData(data);
                        this.setState({
                            unfilteredData: data,
                            data: data, 
                            loadingData: true,
                            conceptChanges: data.length,
                        }, () => {
                            Rest.getRelationChanges(item.version - 1, item.version, (data) => {
                                var preparedData = this.state.unfilteredData;
                                preparedData.push(...data);
                                preparedData = this.sortData(preparedData);
                                if(this.state.selected != null) {
                                    EventDispatcher.fire(this.VERSION_LIST_EVENT_ID);
                                    this.onItemSelected(null);
                                }
                                this.setState({
                                    unfilteredData: preparedData,
                                    data: preparedData, 
                                    loadingData: false,
                                    relationChanges: data.length,
                                });
                                EventDispatcher.fire(Constants.EVENT_VERSION_ITEM_CONTENT_INFO, {
                                    nrConcepts: this.state.conceptChanges, 
                                    nrRelations: this.state.relationChanges,
                                });
                            }, (status) => {
                                App.showError(Util.getHttpMessage(status) + " : misslyckades att hämta förändringar");
                                this.setState({loadingData: false});
                            });
                        });                        
                    }, (status) => {
                        App.showError(Util.getHttpMessage(status) + " : misslyckades att hämta förändringar");
                        this.setState({loadingData: false});
                    });
                }
            }
        });
    }

    getEvent(item) {
        if(item.relation) {
            return Localization.get("relation") + " " + Localization.get(item["event-type"]);
        }
        if(item["concept-attribute-changes"]) {
            var changedAttributes = Localization.get(item["concept-attribute-changes"][0].attribute);
            for(var i=1; i<item["concept-attribute-changes"].length; ++i) {
                changedAttributes += ", " + Localization.get(item["concept-attribute-changes"][i].attribute);
            }
            return changedAttributes + " " + Localization.get("changed");
        }
        return Localization.get("concept") + " " + Localization.get(item["event-type"]);
    }

    getType(item) {
        var type = this.getDbType(item);
        return type != null ? Localization.get("db_" + type) : "";
    }

    getDbType(item) {
        if(item["latest-version-of-concept"]) {
            return item["latest-version-of-concept"].type;
        }
        if(item["changed-concept"]) {
            return item["changed-concept"].type;
        }
        if(item["new-concept"]) {
            return item["new-concept"].type;
        }
        if(item.relation) {
            return item.relation.source.type;
        }
        return null;
    }

    getName(item) {
        if(item["latest-version-of-concept"]) {
            return item["latest-version-of-concept"].preferredLabel;
        }
        if(item["changed-concept"]) {
            return item["changed-concept"].preferredLabel;
        }        
        if(item["new-concept"]) {
            return item["new-concept"].preferredLabel;
        }
        if(item.relation) {
            return item.relation.source.preferredLabel;
        }
        return "";
    }

    getFrom(item) {
        if(item["concept-attribute-changes"]) {
            if(item["concept-attribute-changes"].length == 1) {
                return item["concept-attribute-changes"][0]["old-value"];
            }
        }
        if(item.relation) {
            return Localization.get("db_" + item.relation.source.type);
        }
        return "";
    }

    getTo(item) {
        if(item["concept-attribute-changes"]) {
            if(item["concept-attribute-changes"].length == 1) {
                return item["concept-attribute-changes"][0]["new-value"];
            }
        }
        if(item.relation) {
            return Localization.get("db_" + item.relation.target.type);
        }
        return "";
    }

    getRelationType(item) {
        return item.relation ? item.relation["relation-type"] : "";
    }

    getId(item) {
        if(item["latest-version-of-concept"]) {
            return item["latest-version-of-concept"].id;
        }
        if(item.relation) {
            return item.relation.source.id;
        }
        return "";
    }

    getPageData() {
        if(this.state.data.length == 0 || this.state.range == null) {
            return [];
        }
        var range = this.state.range;
        return this.state.data.slice(range.start, range.end);
    }

    onNewRange(range) {
        this.setState({range: range});
        if(this.state.selected != null) {
            EventDispatcher.fire(this.VERSION_LIST_EVENT_ID);
            this.onItemSelected(null);
        } 
    }

    onItemSelected(item) {
        this.setState({selected: item});
    }

    onFilterChange(value) {  
        if(this.state.selected != null) {
            EventDispatcher.fire(this.VERSION_LIST_EVENT_ID);
            this.onItemSelected(null);
        } 
        this.state.filter = value;
        this.setState({
            filter: value,
            data: this.filterData(),
        });
    }

    onSortClicked(sortBy) {
        if(this.state.selected != null) {
            EventDispatcher.fire(this.VERSION_LIST_EVENT_ID);
            this.onItemSelected(null);
        }      
        if(this.sortBy == sortBy) {
            this.sortDesc = !this.sortDesc;
        } else {
            this.sortBy = sortBy;
            this.sortDesc = false;
        }
        this.setState({ data: this.sortData(this.state.data) });
    }

    onVisitClicked() {
        if(this.state.selected != null) {
            EventDispatcher.fire(Constants.ID_NAVBAR, Constants.WORK_MODE_1);
            setTimeout(() => {
                var visit = {
                    id: this.getId(this.state.selected),
                    type: this.getDbType(this.state.selected),
                    preferredLabel: this.getName(this.state.selected),
                    deprecated: this.state.selected["event-type"] === "DEPRECATED",
                };
                EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, visit);
            }, 500);
        }
    }

    onShowInfoClicked() {
        if(this.state.selected != null) {
            var title = <div className="publish_info_header">
                            <div>{this.getEvent(this.state.selected)}</div>                            
                        </div>;
            EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
                title: title,
                content: this.renderInfoDialog(),
            });
        }
    }

    onSaveClicked() {
        var onSaveExcel = (values) => {
            var data = this.state.data.map((item) => {
                var ret = {};
                for(var i=0; i<values.length; ++i) {
                    ret[values[i].text] = values[i].get(item);
                }
                return ret;            
            }); 

            var columns = [{
                text: Localization.get("type"),
                width: 25,
            }, {
                text: Localization.get("event"),
                width: 25,
            }, {
                text: Localization.get("name"),
                width: 40,
            }, {
                text: Localization.get("from"),
                width: 25,
            }, {
                text: Localization.get("to"),
                width: 25,            
            }, {
                text: Localization.get("relation_type"),
                width: 25,
            }, {
                text: Localization.get("database_id"),
                width: 25,
            }];

            var context = Excel.createSimple("Version - " + this.state.item.version, "Next", columns)
            for(var i=0; i<this.state.data.length; ++i) {
                var item = this.state.data[i];
                var row = [
                    "", 
                    this.getType(item),
                    this.getEvent(item),
                    this.getName(item),
                    this.getFrom(item),
                    this.getTo(item),
                    this.getRelationType(item),
                    this.getId(item),
                ];
                context.addRow(row);
            }
            context.download("Version" + ".xlsx");
            EventDispatcher.fire(Constants.EVENT_HIDE_POPUP_INDICATOR);
        };

        var values = [];

        var title = Localization.get("version") + " - " + (this.state.item.version == -1 ? Localization.get("not_published") : this.state.item.version);

        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("export") + " " + title,
            content: <Export 
                        values={values}
                        onSaveExcel={onSaveExcel}
                    />
        });
    }

    onPublishNewVersionClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("new_version"),
            content: <PublishVersion data={this.state.data}/>,
        });
    }

    onCloseDialogClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    renderInfoItem(name, value, key) {
        return (
            <div 
                key={key}
                className="publish_info_item">
                <div>
                    {name}
                </div>
                <div>
                    {value}
                </div>                
            </div>
        )
    }

    renderInfoDialog() {
        return (
            <div className="dialog_content item_history_dialog">
                <VersionDetail
                    item={this.state.selected}/>
                <div>
                    <Button 
                        text={Localization.get("close")}
                        onClick={this.onCloseDialogClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    renderLoader() {
        if(this.state.loadingData) {
            return (
                <Loader/>
            );
        }
    }

    renderHeader() {
        var renderArrow = (type) => {
            if(type == this.sortBy) {
                return (
                    <SortArrow css={this.sortDesc ? "down" : "up"}/>
                );
            }
        };

        return(
            <div className="version_list_header no_select font">
                <div
                    title={Localization.get("CREATED")} 
                    onClick={this.onSortClicked.bind(this, this.SORT_CONCEPT_TYPE)}>
                    {Localization.get("type")}
                    {renderArrow(this.SORT_CONCEPT_TYPE)}
                </div>
                <div
                    title={Localization.get("DEPRECATED")}
                    onClick={this.onSortClicked.bind(this, this.SORT_EVENT_TYPE)}>
                    {Localization.get("event")}
                    {renderArrow(this.SORT_EVENT_TYPE)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_CONCEPT_LABEL)}>
                    {Localization.get("name")}
                    {renderArrow(this.SORT_CONCEPT_LABEL)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT__FROM)}>
                    {Localization.get("from")}
                    {renderArrow(this.SORT__FROM)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_TO)}>
                    {Localization.get("to")}
                    {renderArrow(this.SORT_TO)}
                </div>                
                <div onClick={this.onSortClicked.bind(this, this.SORT_RELATION_TYPE)}>
                    {Localization.get("relation_type")}
                    {renderArrow(this.SORT_RELATION_TYPE)}
                </div>                
            </div>
        );
    }

    renderItem(item) {
        return(
            <div className="version_list_item">     
                <div title={this.getType(item)}>
                    {this.getType(item)}
                </div>
                <div title={this.getEvent(item)}>
                    {this.getEvent(item)}
                </div>
                <div title={this.getName(item)}>
                    {this.getName(item)}
                </div>
                <div title={this.getFrom(item)}>
                    {this.getFrom(item)}
                </div>
                <div title={this.getTo(item)}>
                    {this.getTo(item)}
                </div>
                <div title={this.getRelationType(item)}>
                    {this.getRelationType(item)}
                </div>
            </div>
        );
    }

    renderPublishButton() {
        if(this.state.item && this.state.item.version == -1) {
            return (
                <Button
                    onClick={this.onPublishNewVersionClicked.bind(this)}
                    text={Localization.get("new_version")}/>
            );
        }
    }

    render() {
        return (
            <div className="version_list">
                <Label text={Localization.get("title_filter")}/>
                <input 
                    type="text" 
                    className="rounded" 
                    value={this.state.filter} 
                    onChange={(e) => this.onFilterChange(e.target.value)}/>
                {this.renderHeader()}
                <List 
                    eventId={this.VERSION_LIST_EVENT_ID}
                    data={this.getPageData()} 
                    onItemSelected={this.onItemSelected.bind(this)}
                    dataRender={this.renderItem.bind(this)}>
                    {this.renderLoader()}
                </List>
                <Pager
                    data={this.state.data}
                    itemsPerPage={50}
                    onNewRange={this.onNewRange.bind(this)}/>                
                <div className="version_list_buttons">
                    <Button 
                        isEnabled={this.state.selected != null}
                        onClick={this.onVisitClicked.bind(this)}
                        text={Localization.get("visit")}/>
                    <Button
                        isEnabled={this.state.selected != null}
                        onClick={this.onShowInfoClicked.bind(this)}
                        text={Localization.get("show")}/>
                    {this.renderPublishButton()}                    
                </div>
            </div>
        );
    }
	
}

export default VersionList;
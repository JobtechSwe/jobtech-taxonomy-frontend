import React from 'react';
import Button from '../../control/button.jsx';
import Pager from '../../control/pager.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';
import Group from '../../control/group.jsx';
import SortArrow from '../../control/sort_arrow.jsx';
import Util from '../../context/util.jsx';
import Constants from '../../context/constants.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Localization from '../../context/localization.jsx';
import Rest from '../../context/rest.jsx';
import Excel from '../../context/excel.jsx';
import Export from '../dialog/export.jsx';

class SearchResult extends React.Component { 

    constructor() {
        super();
        this.SEARCH_RESULT_LIST_EVENT_ID = "SEARCH_RESULT_LIST_EVENT_ID";
        this.SORT_EVENT_TYPE = 1;
        this.SORT_EVENT_EVENT = 2;
        this.SORT_EVENT_NAME = 3;
        this.SORT_EVENT_OLD = 4;
        this.SORT_EVENT_NEW = 5;
        this.SORT_EVENT_DATE = 6;
        this.SORT_EVENT_QUALITY_LEVEL = 7;
        this.SORT_EVENT_RELATION_TYPE = 8;
        this.SORT_EVENT_FROM_NAME = 9;
        this.SORT_EVENT_TO_NAME = 10;
        this.SORT_EVENT_FROM_TYPE = 11;
        this.SORT_EVENT_TO_TYPE = 12;
        this.SORT_EVENT_WEIGHT = 13;
        this.state = {
            searchFor: null,
            searching: false,
            data: [],
            selected: null,
            range: null,
        };
        this.sortBy= this.SORT_EVENT_DATE;
        this.sortDesc= false;
    }

    componentDidMount() {
        if(this.props.search.data) {
            //use saved search
            this.setState({
                searchFor: this.props.search.searchFor,
                data: this.props.search.data,
            });
        } else {
            this.searchFor(this.props.search);
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        if(this.props.search.data) {
            //use saved search
            this.setState({
                searchFor: this.props.search.searchFor,
                data: this.props.search.data,
            });
        } else {
            this.searchFor(props.search);
        }
    }

    searchFor(searchFor) {
        this.sortBy= this.SORT_EVENT_DATE;
        this.sortDesc= false;
        EventDispatcher.fire(Constants.EVENT_SAVE_SEARCH_RESULT, null);
        this.setState({
            searchFor: searchFor,
            searching: true,
            data: [],
            selected: null,
        }, () => {
            if(searchFor.actions.length > 0) {
                Rest.getConceptDayNotes(null, searchFor.fromDate, searchFor.toDate, (data) => {
                    this.setState({
                        searching: false,
                        data: this.filterConceptData(data), 
                    });
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : misslyckades med att utföra sökning");
                    this.setState({searching: false});
                });
            } else {
                Rest.getRelationDayNotes(null, searchFor.fromDate, searchFor.toDate, (data) => {
                    this.setState({
                        searching: false,
                        data: this.filterRelationData(data),
                    });
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : misslyckades med att utföra sökning");
                    this.setState({searching: false});
                });
            }
        });
    }

    filterConceptData(data) {
        //filter event types
        var result = data.filter((item) => {
            return this.state.searchFor.actions.indexOf(item["event-type"]) >= 0;
        });
        //filter concept types
        result = result.filter((item) => {
            return item["latest-version-of-concept"] ? this.state.searchFor.types.indexOf(item["latest-version-of-concept"]["concept/type"]) >= 0 : false;
        });
        return result;
    }

    filterRelationData(data) {
        //filter relation types
        var result = data.filter((item) => {
            return this.state.searchFor.relations.indexOf(item.relation["relation-type"]) >= 0;
        });
        //filter concept types
        result = result.filter((item) => {
            return this.state.searchFor.types.indexOf(item.relation.source["concept/type"]) >= 0 || this.state.searchFor.types.indexOf(item.relation.target["concept/type"]) >= 0;
        });
        return result;
    }
    
    sortData(data) {
        var cmp;
        switch(this.sortBy) {
            default:
            case this.SORT_EVENT_TYPE:
                cmp = (a) => {return this.getType(a);};
                break;
            case this.SORT_EVENT_EVENT:
                cmp = (a) => {return this.getEventType(a);};
                break;
            case this.SORT_EVENT_NAME:
                cmp = (a) => {return this.getName(a);};
                break;
            case this.SORT_EVENT_OLD:
                cmp = (a) => {return this.getOldValue(a);};
                break;
            case this.SORT_EVENT_NEW:
                cmp = (a) => {return this.getNewValue(a)};
                break;
            case this.SORT_EVENT_DATE:
                cmp = (a) => {return this.getDate(a);};
                break;
            case this.SORT_EVENT_QUALITY_LEVEL:
                cmp = (a) => {return this.getQualityLevel(a);};
                break;
            case this.SORT_EVENT_RELATION_TYPE:
                cmp = (a) => {return this.getRelationType(a);};
                break;
            case this.SORT_EVENT_FROM_NAME:
                cmp = (a) => {return this.getFromName(a);};
                break;
            case this.SORT_EVENT_TO_NAME:
                cmp = (a) => {return this.getToName(a);};
                break;
            case this.SORT_EVENT_FROM_TYPE:
                cmp = (a) => {return this.getFromType(a);};
                break;
            case this.SORT_EVENT_TO_TYPE:
                cmp = (a) => {return this.getToType(a);};    
                break;
            case this.SORT_EVENT_WEIGHT:
                cmp = (a) => {return this.getWeight(a);};
                break;
        }
        return Util.sortByCmp(data, cmp, this.sortDesc);
    }

    getType(item) {        
        return (item["latest-version-of-concept"] ? Localization.get("db_" + item["latest-version-of-concept"]["concept/type"]) : "");
    }

    getEventType(item) {
        if(item["concept-attribute-changes"]) {
            var changedAttributes = Localization.get(item["concept-attribute-changes"][0].attribute);
            for(var i=1; i<item["concept-attribute-changes"].length; ++i) {
                changedAttributes += ", " + Localization.get(item["concept-attribute-changes"][i].attribute);
            }
            return changedAttributes + " " + Localization.get("changed");
        } else {
            return Localization.get(item["event-type"]);
        }
        
    }
    
    getName(item) {
        return item["latest-version-of-concept"] ? item["latest-version-of-concept"]["concept/preferredLabel"] : "";
    }
        
    getOldValue(item) {
        if(item["concept-attribute-changes"] && item["concept-attribute-changes"].length == 1) {
            return item["concept-attribute-changes"][0]["old-value"];
        }
        return "";
    }

    getNewValue(item) {
        if(item["concept-attribute-changes"] && item["concept-attribute-changes"].length == 1) {
            return item["concept-attribute-changes"][0]["new-value"];
        }
        return "";
    }

    getDate(item) {
        return item.timestamp;
    }

    getQualityLevel(item) {
        return "";
    }

    getRelationType(item) {
        return Localization.get(item.relation["relation-type"]);
    }

    getFromName(item) {
        return item.relation.source["concept/preferredLabel"];
    }

    getToName(item) {
        return item.relation.target["concept/preferredLabel"];
    }

    getFromType(item) {
        return Localization.get("db_" + item.relation.source["concept/type"]);
    }

    getToType(item) {
        return Localization.get("db_" + item.relation.target["concept/type"]);
    }

    getWeight(item) {
        return "";
    }

    getColumnsFor(item) {
        var cols = [];
        if(item.relation) {
            // relation, from label, to label, from type, to type, vikt, datum, anteckning
            cols.push(Localization.get(item["event-type"]));
            cols.push(Localization.get(item.relation["relation-type"]));
            cols.push(item.relation.source["concept/preferredLabel"]);
            cols.push(item.relation.target["concept/preferredLabel"]);
            cols.push(Localization.get("db_" + item.relation.source["concept/type"]));
            cols.push(Localization.get("db_" + item.relation.target["concept/type"]));
            cols.push("");
            cols.push(new Date(item.timestamp).toLocaleString());
            cols.push(item.comment);
        } else {
            // typ, åtgärd, namn, från, till, datum, kvalitetsnivå, anteckning
            cols.push(this.getType(item));
            cols.push(this.getEventType(item));
            cols.push(this.getName(item));
            cols.push(this.getOldValue(item));
            cols.push(this.getNewValue(item));
            cols.push(new Date(this.getDate(item)).toLocaleString());
            cols.push(this.getQualityLevel(item));
            cols.push(item.comment);
        }        
        return cols;
    }

    getPageData() {
        if(this.state.data.length == 0 || this.state.range == null) {
            return [];
        }
        var range = this.state.range;
        return this.state.data.slice(range.start, range.end);
    }

    onSortClicked(sortBy) {
        if(this.state.selected != null) {
            EventDispatcher.fire(this.SEARCH_RESULT_LIST_EVENT_ID);
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
            EventDispatcher.fire(Constants.EVENT_SAVE_SEARCH_RESULT, {
                searchFor: this.state.searchFor, 
                data: this.state.data,
            });

            EventDispatcher.fire(Constants.ID_NAVBAR, Constants.WORK_MODE_1);
            setTimeout(() => {
                //this.state.selected["changed-concept"]
                var item = {
                    id: this.state.selected["concept-id"],
                    type: this.state.selected.type,
                };
                if(this.state.selected.concept) {
                    item.type = this.state.selected.concept["concept/type"];
                } else if(this.state.selected.relation) {
                    item.id = this.state.selected.relation.source["concept/id"];
                    item.type = this.state.selected.relation.source["concept/type"];
                }
                EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, item);
            }, 500);
        }
    }

    onSaveClicked() {
        var onSaveExcel = () => {
            var columns = [];
            if(this.state.searchFor.actions.length > 0) {
                columns = [{
                        text: Localization.get("type"),
                        width: 20,
                    }, {
                        text: Localization.get("action"),
                        width: 20,
                    }, {
                        text: Localization.get("name"),
                        width: 35,
                    }, {
                        text: Localization.get("from"),
                        width: 35,
                    }, {
                        text: Localization.get("to"),
                        width: 35,
                    }, {
                        text: Localization.get("date"),
                        width: 20,
                    }, {
                        text: Localization.get("quality_level_short"),
                        width: 10,
                    }, {
                        text: Localization.get("note"),
                        width: 35,
                    }];
            } else {
                columns = [{
                        text: Localization.get("action"),
                        width: 20,
                    }, {
                        text: Localization.get("relation_type"),
                        width: 20,
                    }, {
                        text: Localization.get("from_name"),
                        width: 35,
                    }, {
                        text: Localization.get("to_name"),
                        width: 35,
                    }, {
                        text: Localization.get("from_type"),
                        width: 35,
                    }, {
                        text: Localization.get("to_type"),
                        width: 35,
                    }, {
                        text: Localization.get("weight"),
                        width: 20,
                    }, {
                        text: Localization.get("date"),
                        width: 20,
                    }, {
                        text: Localization.get("note"),
                        width: 35,
                    }];
            }
            var context = Excel.createSimple(this.state.searchFor.fromDate.toLocaleString() + " - " + this.state.searchFor.toDate.toLocaleString(), "latest", columns);
            for(var i=0; i<this.state.data.length; ++i) {
                var row = this.getColumnsFor(this.state.data[i]);
                row.unshift("");
                context.addRow(row);
            }
            context.download(Localization.get("search_result") + ".xlsx");
            EventDispatcher.fire(Constants.EVENT_HIDE_POPUP_INDICATOR);
        };

        // event
        var values = [];
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("export") + " " + Localization.get("search_result"),
            content: <Export 
                        values={values}
                        onSaveExcel={onSaveExcel}/>
        });        
    }

    onItemSelected(item) {
        this.setState({
            selected: item,
        });
    }

    onNewRange(range) {
        this.setState({range: range});
    }

    renderItem(item) {
        var key = 0;
        var cols = [];
        var css = item.relation ? "search_result_relation_item" : "search_result_concept_item";
        var itemData = this.getColumnsFor(item);
        for(var i=0; i<itemData.length - 1; ++i) {
            cols.push(<div key={key++}>{itemData[i]}</div>);
        }        
        return (
            <div
                className={css}
                title={item.comment}>
                {cols}
            </div>
        );
    }

    renderHeader() {
        var renderArrow = (type) => {
            if(type == this.sortBy) {
                return (
                    <SortArrow css={this.sortDesc ? "down" : "up"}/>
                );
            }
        };
        
        if(this.state.searchFor != null) {
            if(this.state.searchFor.actions.length > 0) {
                return (
                    <div className="search_result_concept_item search_result_header no_select font">
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_TYPE)}>
                            {Localization.get("type")}
                            {renderArrow(this.SORT_EVENT_TYPE)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_EVENT)}>
                            {Localization.get("action")}
                            {renderArrow(this.SORT_EVENT_EVENT)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_NAME)}>
                            {Localization.get("name")}
                            {renderArrow(this.SORT_EVENT_NAME)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_OLD)}>
                            {Localization.get("from")}
                            {renderArrow(this.SORT_EVENT_OLD)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_NEW)}>
                            {Localization.get("to")}
                            {renderArrow(this.SORT_EVENT_NEW)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_DATE)}>
                            {Localization.get("date")}
                            {renderArrow(this.SORT_EVENT_DATE)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_QUALITY_LEVEL)}>
                            {Localization.get("quality_level_short")}
                            {renderArrow(this.SORT_EVENT_QUALITY_LEVEL)}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="search_result_relation_item search_result_header no_select font">
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_EVENT)}>
                            {Localization.get("action")}
                            {renderArrow(this.SORT_EVENT_EVENT)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_RELATION_TYPE)}>
                            {Localization.get("relation_type")}
                            {renderArrow(this.SORT_EVENT_RELATION_TYPE)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_FROM_NAME)}>
                            {Localization.get("from_name")}
                            {renderArrow(this.SORT_EVENT_FROM_NAME)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_TO_NAME)}>
                            {Localization.get("to_name")}
                            {renderArrow(this.SORT_EVENT_TO_NAME)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_FROM_TYPE)}>
                            {Localization.get("from_type")}
                            {renderArrow(this.SORT_EVENT_FROM_TYPE)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_TO_TYPE)}>
                            {Localization.get("to_type")}
                            {renderArrow(this.SORT_EVENT_TO_TYPE)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_WEIGHT)}>
                            {Localization.get("weight")}
                            {renderArrow(this.SORT_EVENT_WEIGHT)}
                        </div>
                        <div
                            onClick={this.onSortClicked.bind(this, this.SORT_EVENT_DATE)}>
                            {Localization.get("date")}
                            {renderArrow(this.SORT_EVENT_DATE)}
                        </div>
                    </div>
                );
            }
        }
    }

    renderLoader() {
        if(this.state.searching) {
            return (
                <Loader/>
            );
        }
    }

    renderResult() {
        return(
            <div className="search_result">
                {this.renderHeader()}
                 <List 
                    eventId={this.SEARCH_RESULT_LIST_EVENT_ID}
                    data={this.getPageData()} 
                    onItemSelected={this.onItemSelected.bind(this)}
                    dataRender={this.renderItem.bind(this)}>
                    {this.renderLoader()}
                </List>
                <Pager
                    data={this.state.data}
                    itemsPerPage={10}
                    onNewRange={this.onNewRange.bind(this)}/>
                <div className="search_result_buttons">
                    <Button 
                        isEnabled={this.state.selected != null}
                        text={Localization.get("visit")}
                        onClick={this.onVisitClicked.bind(this)}/>
                    <Button 
                        isEnabled={this.state.data.length > 0}
                        text={Util.renderExportButtonText()}
                        onClick={this.onSaveClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    render() {
        return(
            <Group 
                css="search_result_group"
                text={Localization.get("search_result")}>
                {this.renderResult()}
            </Group>
        );
    }
	
}

export default SearchResult;
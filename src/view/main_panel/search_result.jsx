import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';
import Group from '../../control/group.jsx';
import SortArrow from '../../control/sort_arrow.jsx';
import Util from '../../context/util.jsx';
import Constants from '../../context/constants.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Localization from '../../context/localization.jsx';
import Rest from '../../context/rest.jsx';
import localization from '../../context/localization.jsx';
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
            tempData: [],
            conceptIds: null,
            selected: null,
        };
        this.sortBy= this.SORT_EVENT_DATE;
        this.sortDesc= false;
    }

    componentDidMount() {
        this.searchFor(this.props.search);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.searchFor(props.search);
    }

    searchFor(searchFor) {
        this.sortBy= this.SORT_EVENT_DATE;
        this.sortDesc= false;
        this.setState({
            searchFor: searchFor,
            searching: true,
            data: [],
            tempData: [],
            conceptIds: null,
            selected: null,
        }, () => {
            if(searchFor.actions.length > 0) {
                Rest.getConceptDayNotes(null, searchFor.fromDate, searchFor.toDate, (data) => {
                    var result = this.filterConceptActions(data);
                    var tempData = result.filter((item) => {
                        return !item.concept;
                    });
                    result = result.filter((item) => {
                        return item.concept;
                    });
                    this.setState({
                        data: this.filterConceptTypes(result), 
                        tempData: tempData,
                        conceptIds: this.findConceptIds(tempData),
                    }, () => {this.getConcepts()});
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : misslyckades med att utföra sökning");
                    this.setState({searching: false});
                });
            } else {
                Rest.getRelationDayNotes(null, searchFor.fromDate, searchFor.toDate, (data) => {
                    this.setState({
                        searching: false,
                        data: this.filterRelationData(data),
                        conceptIds: null,
                    });
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : misslyckades med att utföra sökning");
                    this.setState({searching: false});
                });
            }
        });
    }

    getConcepts() {
        if(!this.state.conceptIds || this.state.conceptIds.length == 0) {
            if(this.state.tempData.length > 0) {
                this.state.data.push(...this.state.tempData.filter((item) => {
                    return this.state.searchFor.types.indexOf(item.type) >= 0;
                }));
            }
            this.setState({
                searching: false,
                data: this.state.data,
                tempData: [],
                conceptIds: [],
            });
            return;
        }
        Rest.getConceptExtraField(this.state.conceptIds.pop(), "", (data) => {
            for(var i=0; i<this.state.tempData.length; ++i) {
                var item = this.state.tempData[i];
                if(item["concept-id"] === data[0].id) {
                    item.type = data[0].type;
                    item.preferredLabel = data[0].preferredLabel;
                    item.quality_level = data[0].quality_level;
                }
            }
            this.getConcepts();
        }, (status) => {
            //TODO
        })
    }

    findConceptIds(data) {
        var result = [];
        for(var i=0; i<data.length; ++i) {
            result.push(data[i]["concept-id"]);
        }
        return Array.from(new Set(result));
    }

    filterConceptActions(data) {
        var result = data.filter((item) => {
            return this.state.searchFor.actions.indexOf(item["event-type"]) >= 0;
        });
        return result;
    }

    filterConceptTypes(data) {
        var result = data.filter((item) => {
            return item.concept ? this.state.searchFor.types.indexOf(item.concept["concept/type"]) >= 0 : false;
        });
        return result;
    }

    filterRelationData(data) {
        var result = data.filter((item) => {
            return this.state.searchFor.relations.indexOf(item.relation["relation-type"]) >= 0;
        });
        return result;
    }
    
    sortData(data) {
        var cmp;
        switch(this.sortBy) {
            default:
            case this.SORT_EVENT_TYPE:
                cmp = (a) => {return Localization.get("db_" + (a.concept ? a.concept["concept/type"] : a.type));};
                break;
            case this.SORT_EVENT_EVENT:
                cmp = (a) => {return Localization.get(a["event-type"]);};
                break;
            case this.SORT_EVENT_NAME:
                cmp = (a) => {return a.concept ? a.concept["concept/preferredLabel"] : a.preferredLabel;};
                break;
            case this.SORT_EVENT_OLD:
                cmp = (a) => {return a.changes ? a.changes[0]["old-value"] : "";};
                break;
            case this.SORT_EVENT_NEW:
                cmp = (a) => {return a.changes ? a.changes[0]["new-value"] : (a.concept ? a.concept["concept/definition"] : "");};
                break;
            case this.SORT_EVENT_DATE:
                cmp = (a) => {return a.timestamp;};
                break;
            case this.SORT_EVENT_QUALITY_LEVEL:
                cmp = (a) => {return a.concept ? a.concept["concept/quality-level"] : a.quality_Label;};
                break;
            case this.SORT_EVENT_RELATION_TYPE:
                cmp = (a) => {return Localization.get(a.relation["relation-type"]);};
                break;
            case this.SORT_EVENT_FROM_NAME:
                cmp = (a) => {return a.relation.source["concept/preferredLabel"];};
                break;
            case this.SORT_EVENT_TO_NAME:
                cmp = (a) => {return a.relation.target["concept/preferredLabel"];};
                break;
            case this.SORT_EVENT_FROM_TYPE:
                cmp = (a) => {return Localization.get("db_" + a.relation.source["concept/type"]);};
                break;
            case this.SORT_EVENT_TO_TYPE:
                cmp = (a) => {return Localization.get("db_" + a.relation.target["concept/type"]);};    
                break;
            case this.SORT_EVENT_WEIGHT:
                cmp = (a) => {return "";};
                break;
        }
        return Util.sortByCmp(data, cmp, this.sortDesc);
    }

    getColumnsFor(item) {
        var cols = [];
        if(item.changes) {
            // typ, åtgärd, namn, från, till, datum, kvalitetsnivå, anteckning
            cols.push(item.type == null ? "" : Localization.get("db_" + item.type));
            cols.push(Localization.get(item["event-type"]) + " " + localization.get(item.changes[0]["attribute"]));
            cols.push(item.preferredLabel == null ? "" : item.preferredLabel);
            cols.push(item.changes[0]["old-value"]);
            cols.push(item.changes[0]["new-value"]);
            cols.push(new Date(item.timestamp).toLocaleString());
            cols.push("");
            cols.push(item.comment);
        } else if(item.concept) {
            // typ, åtgärd, namn, från, till, datum, kvalitetsnivå, anteckning
            cols.push(Localization.get("db_" + item.concept["concept/type"]));
            cols.push(Localization.get(item["event-type"]));
            cols.push(item.concept["concept/preferredLabel"]);
            cols.push("");
            cols.push(item.concept["concept/definition"]);
            cols.push(new Date(item.timestamp).toLocaleString());
            cols.push(item.concept["concept/quality-level"]);
            cols.push(item.comment);
        } else if(item.relation) {
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
            cols.push(Localization.get("db_" + item.type));
            cols.push(Localization.get(item["event-type"]));
            cols.push(item.preferredLabel);
            cols.push("");
            cols.push("");
            cols.push(new Date(item.timestamp).toLocaleString());
            cols.push(item.quality_level);
            cols.push(item.comment);
        }        
        return cols;
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
                    data={this.state.data} 
                    onItemSelected={this.onItemSelected.bind(this)}
                    dataRender={this.renderItem.bind(this)}>
                    {this.renderLoader()}
                </List>
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
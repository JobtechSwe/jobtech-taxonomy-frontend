import React from 'react';
import XLSX from 'xlsx';
import Button from '../../control/button.jsx';
import Label from '../../control/label.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';
import SortArrow from '../../control/sort_arrow.jsx';
import Constants from '../../context/constants.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Util from '../../context/util.jsx';
import Excel from '../../context/excel.jsx';
import App from '../../context/app.jsx';
import Export from '../dialog/export.jsx';
import PublishVersion from '../dialog/publish_version.jsx';

class VersionList extends React.Component { 

    constructor() {
        super();
        this.VERSION_LIST_EVENT_ID = "VERSION_LIST_EVENT_ID";
        this.SORT_EVENT_TYPE = 0;
        this.SORT_CONCEPT_TYPE = 1;
        this.SORT_CONCEPT_LABEL = 2;
        this.SORT_CONCEPT_FROM = 3;
        this.SORT_CONCEPT_TO = 4;
        this.SORT_EVENT_DATE = 5;
        this.SORT_CONCEPT_RELATION = 6;
        this.state = {
            item: null,
            data: [],
            filter: "",
            loadingData: false,
            selected: null,
        }
        this.sortBy= this.SORT_EVENT_TYPE;
        this.sortDesc= false;
    }

    componentDidMount() {
        this.getChanges(this.props.item);
    }

    UNSAFE_componentWillReceiveProps(props) {
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
                cmp = (a) => {return Localization.get(a["event-type"]);};
                break;
            case this.SORT_CONCEPT_TYPE:
                cmp = (a) => {return Localization.get("db_" + a["changed-concept"].type);};
                break;
            case this.SORT_CONCEPT_LABEL:
                cmp = (a) => {return a["changed-concept"].preferredLabel;};
                break;
        }
        return Util.sortByCmp(data, cmp, this.sortDesc);
    }

    filterData() {
        // check if empty
        if(/^\s*$/.test(this.state.filter)) {
            return this.state.data;
        }
        var lowerCaseFilter = this.state.filter.toLowerCase();
        return this.state.data.filter((e) => {
            return e["changed-concept"].preferredLabel.toLowerCase().indexOf(lowerCaseFilter) >= 0 ||
                Localization.get("db_" + e["changed-concept"].type).toLowerCase().indexOf(lowerCaseFilter) >= 0 ||
                Localization.get(e["event-type"]).toLowerCase().indexOf(lowerCaseFilter) >= 0;
        });
    }

    getChanges(item) {        
        this.setState({
            data: [], 
            loadingData: true,
            item: item,
        }, () => {
            EventDispatcher.fire(Constants.EVENT_VERSION_ITEM_SELECTED, null);
            if(item) {
                Rest.abort();
                if(item.version == -1) {
                    Rest.getUnpublishedChanges(item.latestVersion, (data) => {
                        this.setState({
                            data: this.sortData(data), 
                            loadingData: false,
                        });
                    }, (status) => {
                        App.showError(Util.getHttpMessage(status) + " : misslyckades att hämta förändringar");
                        this.setState({loadingData: false});
                    });
                } else {
                    Rest.getChanges(item.version - 1, item.version, (data) => {
                        this.setState({
                            data: this.sortData(data), 
                            loadingData: false,
                        });
                    }, (status) => {
                        App.showError(Util.getHttpMessage(status) + " : misslyckades att hämta förändringar");
                        this.setState({loadingData: false});
                    });
                }
            }
        });
    }

    onItemSelected(item) {       
        this.setState({selected: item}, () => {
            EventDispatcher.fire(Constants.EVENT_VERSION_ITEM_SELECTED, item);
        });
    }

    onFilterChange(value) {  
        if(this.state.selected != null) {
            EventDispatcher.fire(this.VERSION_LIST_EVENT_ID);
            this.onItemSelected(null);
        }      
        this.setState({filter: value});
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
                EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, this.state.selected["changed-concept"]);
            }, 500);
        }
    }

    onShowInfoClicked() {
        if(this.state.selected != null) {
            var title = <div className="publish_info_header">
                            <div>{"[date] " + Localization.get(this.state.selected["event-type"])}</div>
                            <div>[user]</div>
                        </div>;
            EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
                title: title,
                content: this.renderInfoDialog(),
            });
        }
    }

    onSaveClicked() {
        var onSaveExcel = (values) => {
            console.log(values);
            var data = this.filterData().map((item) => {
                var ret = {};
                for(var i=0; i<values.length; ++i) {
                    ret[values[i].text] = values[i].get(item);
                }
                return ret;            
            }); 
            var width = [];
            for(var i=0; i<values.length; ++i) {
                var key = values[i].text;
                var maxWidth = Math.max(...(data.map((item) => {
                    return item[key] != null ? item[key].length : 0;
                })));
                width.push({width: maxWidth});
            }
            var worksheet = XLSX.utils.json_to_sheet(data);            
            worksheet['!cols'] = width;
            var new_workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(new_workbook, worksheet, "Version - " + this.state.item.version);
            XLSX.writeFile(new_workbook, "Version.xlsx");
        }

        var values = [];
        values.push({
            text: Localization.get("event"),
            get: (item) => {
                return Localization.get(item["event-type"]);
            },
            selected: true
        });
        values.push({
            text: Localization.get("value_storage"),
            get: (item) => {
                return Localization.get("db_" + item["changed-concept"].type);
            },
            selected: true
        });
        values.push({
            text: Localization.get("name"),
            get: (item) => {
                return item["changed-concept"].preferredLabel;
            },
            selected: true
        });

        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("export"),
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
        var info = [];
        var key = 0;
        if(this.state.selected["event-type"] === "CREATED") {
            info.push(this.renderInfoItem("Namn", this.state.selected["changed-concept"].preferredLabel, key++));
            info.push(this.renderInfoItem("Definition", "[definition]", key++));
            info.push(this.renderInfoItem("Id", this.state.selected["changed-concept"].id, key++));
            info.push(this.renderInfoItem("Typ", Localization.get("db_" + this.state.selected["changed-concept"].type), key++));
            info.push(this.renderInfoItem("Kvalitetsnivå", "[kvalitetsnivå]", key++));
            info.push(this.renderInfoItem("Anteckning", "[anteckning]", key++));                 
        } else if(this.state.selected["event-type"] === "UPDATED") {
            info.push(this.renderInfoItem("Namn", this.state.selected["changed-concept"].preferredLabel, key++));
            info.push(this.renderInfoItem("Definition", "[definition]", key++));
            info.push(this.renderInfoItem("Id", this.state.selected["changed-concept"].id, key++));
            info.push(this.renderInfoItem("Typ", Localization.get("db_" + this.state.selected["changed-concept"].type), key++));
            info.push(this.renderInfoItem("Åtgärd", "[åtgärd]", key++));
            info.push(this.renderInfoItem("Från", "[från]", key++));
            info.push(this.renderInfoItem("Till", "[till]", key++));
            info.push(this.renderInfoItem("Anteckning", "[anteckning]", key++));    
        } else if(this.state.selected["event-type"] === "DEPRECATED") {
            info.push(this.renderInfoItem("Namn", this.state.selected["changed-concept"].preferredLabel, key++));
            info.push(this.renderInfoItem("Definition", "[definition]", key++));
            info.push(this.renderInfoItem("Id", this.state.selected["changed-concept"].id, key++));
            info.push(this.renderInfoItem("Typ", Localization.get("db_" + this.state.selected["changed-concept"].type), key++));
            info.push(this.renderInfoItem("Åtgärd", "[åtgärd]", key++));
            info.push(this.renderInfoItem("Hävisad till", "[hänvisad_till]", key++));
            info.push(this.renderInfoItem("Anteckning", "[anteckning]", key++));    
        } else {
            info.push(this.renderInfoItem("Namn", this.state.selected["changed-concept"].preferredLabel, key++));
            info.push(this.renderInfoItem("Definition", "[definition]", key++));
            info.push(this.renderInfoItem("Id", this.state.selected["changed-concept"].id, key++));
            info.push(this.renderInfoItem("Typ", Localization.get("db_" + this.state.selected["changed-concept"].type), key++));
            info.push(this.renderInfoItem("Kvalitetsnivå", "[kvalitetsnivå]", key++));
            info.push(this.renderInfoItem("Anteckning", "[anteckning]", key++));
        }

        return(
            <div className="dialog_content item_history_dialog">
                <div>
                    {info}
                </div>
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

        /*<div onClick={this.onSortClicked.bind(this, this.SORT_CONCEPT_FROM)}>
                    {Localization.get("from")}
                    {renderArrow(this.SORT_CONCEPT_FROM)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_CONCEPT_TO)}>
                    {Localization.get("to")}
                    {renderArrow(this.SORT_CONCEPT_TO)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_EVENT_DATE)}>
                    {Localization.get("date")}
                    {renderArrow(this.SORT_EVENT_DATE)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_CONCEPT_RELATION)}>
                    {Localization.get("relation_type")}
                    {renderArrow(this.SORT_CONCEPT_RELATION)}
                </div>
                */
        return(
            <div className="version_list_header no_select font">               
                <div onClick={this.onSortClicked.bind(this, this.SORT_CONCEPT_TYPE)}>
                    {Localization.get("value_storage")}
                    {renderArrow(this.SORT_CONCEPT_TYPE)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_EVENT_TYPE)}>
                    {Localization.get("event")}
                    {renderArrow(this.SORT_EVENT_TYPE)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_CONCEPT_LABEL)}>
                    {Localization.get("name")}
                    {renderArrow(this.SORT_CONCEPT_LABEL)}
                </div>                
            </div>
        );
    }

    renderItem(item) {
        return(
            <div className="version_list_item">               
                <div>
                    {Localization.get("db_" + item["changed-concept"].type)}
                </div>
                <div>
                    {Localization.get(item["event-type"])}
                </div>
                <div>
                    {item["changed-concept"].preferredLabel}
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
        /*
         <Button 
                        isEnabled={this.state.selected != null}
                        onClick={this.onShowInfoClicked.bind(this)}
                        text={Localization.get("show")}/>
         */
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
                    data={this.filterData()} 
                    onItemSelected={this.onItemSelected.bind(this)}
                    dataRender={this.renderItem.bind(this)}>
                    {this.renderLoader()}
                </List>
                <div className="version_list_buttons">
                    <Button 
                        isEnabled={this.state.selected != null}
                        onClick={this.onVisitClicked.bind(this)}
                        text={Localization.get("visit")}/>                   
                    {this.renderPublishButton()}
                    <Button                             
                        onClick={this.onSaveClicked.bind(this)}
                        text={Localization.get("export")}/>
                </div>
            </div>
        );
    }
	
}

export default VersionList;
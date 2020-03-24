import React from 'react';
import XLSX from 'xlsx';
import Button from '../../control/button.jsx';
import Group from '../../control/group.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';
import SortArrow from '../../control/sort_arrow.jsx';
import Constants from '../../context/constants.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';
import Util from '../../context/util.jsx';
import Export from '../dialog/export.jsx';

class Referred extends React.Component { 

    constructor() {
        super();
        this.SORT_EVENT_LABEL = "SORT_EVENT_LABEL";
        this.SORT_EVENT_TYPE = "SORT_EVENT_TYPE";
        this.SORT_EVENT_REPLACED_BY_LABEL = "SORT_EVENT_REPLACED_BY_LABEL";
        this.SORT_EVENT_REPLACED_BY_TYPE = "SORT_EVENT_REPLACED_BY_TYPE";
        this.state = {
            data: [],
            loadingData: true,
            selected: null,
        }
        this.sortBy= this.SORT_EVENT_LABEL;
        this.sortDesc= true;
    }

    componentDidMount() {
        Rest.getDepricatedConcepts((data) => {
            var filtered = data.filter((d) => {
                return d["replaced-by"] ? true : false;
            });
            this.setState({
                data: this.sortData(filtered),
                loadingData: false,
            });
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : " + "Misslyckades med att hämta konsept");
            this.setState({
                loadingData: false,
            });
        });
    }

    sortData(data) {
        var cmp;
        switch(this.sortBy) {
            default:
            case this.SORT_EVENT_LABEL:
                cmp = (a) => {return a.preferredLabel;};
                break;
            case this.SORT_EVENT_TYPE:
                cmp = (a) => {return Localization.get("db_" + a.type);};
                break;
            case this.SORT_EVENT_REPLACED_BY_LABEL:
                cmp = (a) => {return a["replaced-by"][0].preferredLabel;};
                break;
            case this.SORT_EVENT_REPLACED_BY_TYPE:
                cmp = (a) => {return Localization.get("db_" + a["replaced-by"][0].type);};
                break;
        }
        return Util.sortByCmp(data, cmp, this.sortDesc);
    }

    onItemSelected(item) {       
        this.setState({selected: item});
    }

    onSortClicked(sortBy) {
        if(this.sortBy === sortBy) {
            this.sortDesc = !this.sortDesc;
        } else {
            this.sortBy = sortBy;
            this.sortDesc = false;
        }
        EventDispatcher.fire("EVENT_CLEAR_REFERRED_CONCEPTS_LIST");
        this.setState({
            data: this.sortData(this.state.data),
            selected: null,
        });
    }

    onVisitClicked() {
        if(this.state.selected != null) {
            EventDispatcher.fire(Constants.ID_NAVBAR, Constants.WORK_MODE_1);
            setTimeout(() => {
                EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, this.state.selected);
            }, 500);
        }
    }

    onVisitReplacedByClicked() {
        if(this.state.selected != null) {
            Rest.getConcept(this.state.selected["replaced-by"][0].id, (data) => {                
                EventDispatcher.fire(Constants.ID_NAVBAR, Constants.WORK_MODE_1);
                setTimeout(() => {
                    EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, data[0]);
                }, 500);
            }, (status) => {
                App.showError(Util.getHttpMessage(status) + " : " + "Misslyckades med att hämta konsept");
            })
        }
    }

    onExportClicked() {
        var onSaveExcel = (values) => {
            var data = this.state.data.map((item) => {
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
            XLSX.utils.book_append_sheet(new_workbook, worksheet, Localization.get("referred"));
            XLSX.writeFile(new_workbook, Localization.get("referred") + ".xlsx");
            EventDispatcher.fire(Constants.EVENT_HIDE_POPUP_INDICATOR);
        }        

        var values = [];
        values.push({
            text: Localization.get("concept") + " - " + Localization.get("type"),
            get: (item) => {
                return Localization.get("db_" + item.type);
            },
            selected: true
        });
        values.push({
            text: Localization.get("concept") + " - " + Localization.get("name"),
            get: (item) => {
                return item.preferredLabel;
            },
            selected: true
        });
        values.push({
            text: Localization.get("replaced_by_concept") + " - " + Localization.get("type"),
            get: (item) => {
                return Localization.get("db_" + item["replaced-by"][0].type);
            },
            selected: true
        });
        values.push({
            text: Localization.get("replaced_by_concept") + " - " + Localization.get("name"),
            get: (item) => {
                return item["replaced-by"][0].preferredLabel;
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

    renderItem(item) {
        return (
            <div className="referred_concepts_item">
                <div>{Localization.get("db_" + item.type)}</div>
                <div>{item.preferredLabel}</div>
                <div>{Localization.get("db_" + item["replaced-by"][0].type)}</div>
                <div>{item["replaced-by"][0].preferredLabel}</div>
            </div>
        );
    }

    renderTopHeader() {
        return (            
            <div className="referred_concepts_top_header no_select font">
                <div>
                    {Localization.get("concept")}
                </div>
                <div>
                    {Localization.get("replaced_by_concept")}
                </div>
            </div>
        )
    }

    renderHeader() {
        var renderArrow = (type) => {
            if(type == this.sortBy) {
                return (
                    <SortArrow css={this.sortDesc ? "down" : "up"}/>
                );
            }
        };
        return (
            <div className="referred_concepts_header no_select font">               
                <div onClick={this.onSortClicked.bind(this, this.SORT_EVENT_TYPE)}>
                    {Localization.get("type")}
                    {renderArrow(this.SORT_EVENT_TYPE)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_EVENT_LABEL)}>
                    {Localization.get("name")}
                    {renderArrow(this.SORT_EVENT_LABEL)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_EVENT_REPLACED_BY_TYPE)}>
                    {Localization.get("type")}
                    {renderArrow(this.SORT_EVENT_REPLACED_BY_TYPE)}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_EVENT_REPLACED_BY_LABEL)}>
                    {Localization.get("name")}
                    {renderArrow(this.SORT_EVENT_REPLACED_BY_LABEL)}
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

    render() {
        return (
            <Group
                text={Localization.get("referred")}>
                <div className="referred_concepts">
                    {this.renderTopHeader()}
                    {this.renderHeader()}
                    <List
                        eventId="EVENT_CLEAR_REFERRED_CONCEPTS_LIST"
                        data={this.state.data}
                        onItemSelected={this.onItemSelected.bind(this)}
                        dataRender={this.renderItem.bind(this)}>
                        {this.renderLoader()}
                    </List>
                    <div className="referred_button">
                        <Button 
                            isEnabled={this.state.selected != null}
                            onClick={this.onVisitClicked.bind(this)}
                            text={Localization.get("visit_concept")}/>
                        <Button 
                            isEnabled={this.state.selected != null}
                            onClick={this.onVisitReplacedByClicked.bind(this)}
                            text={Localization.get("visit_replaced_by")}/>
                        <Button                             
                            onClick={this.onExportClicked.bind(this)}
                            text={Localization.get("export")}/>
                    </div>
                </div>               
            </Group>
        );
    }
}

export default Referred;
import React from 'react';
import Label from '../../control/label.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';
import Button from '../../control/button.jsx';
import Constants from '../../context/constants.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Localization from '../../context/localization.jsx';
import App from '../../context/app.jsx';
import Rest from '../../context/rest.jsx';
import Util from '../../context/util.jsx';

class ItemHistory extends React.Component { 

    constructor() {
        super();
        this.LIST_EVENT_ID = "ITEMHISTORY_LIST_ID";
        this.state = {
            concept: null,
            data: [],
            selected: null,
            loadingConceptChanges: false,
            loadingRelationChanges: false,
            from: null,
            to: null
        };
    }

    componentDidMount() {
        this.init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        EventDispatcher.fire(this.LIST_EVENT_ID);
        this.init(props);
    }

    init(props) {
        this.setState({
            concept: props.item,
            data: [],
            selected: null,
            loadingConceptChanges: true,
            loadingRelationChanges: true,
            from: props.from,
            to: props.to
        }, () => {
            if(props.item) {
                Rest.getConceptDayNotes(props.item.id, props.from, props.to, (data) => {
                    data = data.filter(Boolean);
                    for(var i=0; i<data.length; ++i) {
                        var item = data[i];
                        item.date = new Date(item.timestamp);
                        item.event = item["event-type"];
                    }
                    this.state.data.push(...data);
                    this.setState({
                        data: Util.sortByKey(this.state.data, "date", false),
                        loadingConceptChanges: false,
                    });
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : Hämta daganteckningar (concept) misslyckades");
                });
                Rest.getRelationDayNotes(props.item.id, props.from, props.to, (data) => {
                    for(var i=0; i<data.length; ++i) {
                        var item = data[i];
                        item.date = new Date(item.timestamp);
                        item.event = item["event-type"];
                    }
                    this.state.data.push(...data);
                    this.setState({
                        data: Util.sortByKey(this.state.data, "date", false),
                        loadingRelationChanges: false,
                    });
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : Hämta daganteckningar (relationer) misslyckades");
                });
            }
        });
    }

    onCloseDialogClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    onShowClicked() {
        if(this.state.selected) {
            EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
                title:this.renderItem(this.state.selected, true),
                content: this.renderHistoryDialog(),
            });
        }
    }

    onItemSelected(item) {
        this.setState({selected: item});
    }

    renderInfoItem(name, value, key) {
        return (
            <div 
                key={key}
                className="item_history_dialog_item">
                <div>
                    {name}
                </div>
                <div>
                    {value}
                </div>
            </div>
        );
    }

    renderHistoryShowItem(item) {
        var info = [];
        var key = 0;
        if(item.concept) {
            info.push(this.renderInfoItem(Localization.get("name"), item.concept["concept/preferredLabel"], key++));
            info.push(this.renderInfoItem(Localization.get("description"), item.concept["concept/definition"], key++));
            info.push(this.renderInfoItem(Localization.get("id"), item.concept["concept/id"], key++));
            info.push(this.renderInfoItem(Localization.get("type"), Localization.get("db_" + item.concept["concept/type"]), key++));
            if(item["event-type"] === "CREATED") {
                //not deprecated
                info.push(this.renderInfoItem("Kvalitetsnivå", item.concept["concept/quality-level"], key++));
            } else {
                //deprecated
                info.push(this.renderInfoItem(Localization.get("action"), "[åtgärd]", key++));
                info.push(this.renderInfoItem("Hävisad till", "[hänvisad_till]", key++));
            }
        }
        if(item.changes) {
            if(this.selected) {
                info.push(this.renderInfoItem(Localization.get("id"), this.selected.id, key++));
            }
            //info.push(this.renderInfoItem("Typ", Localization.get("db_" + item.type), key++));
            for(var i=0; i<item.changes.length; ++i) {
                var change = item.changes[i];
                info.push(this.renderInfoItem(Localization.get("action"), Localization.get("changed") + " " + Localization.get(change.attribute), key++));
                info.push(this.renderInfoItem(Localization.get("from"), change["old-value"], key++));
                info.push(this.renderInfoItem(Localization.get("to"), change["new-value"], key++));
            }
        }
        if(item.relation) {
            if(this.selected) {
                info.push(this.renderInfoItem(Localization.get("id"), this.selected.id, key++));
            }
            //info.push(this.renderInfoItem("Typ", Localization.get("db_" + item.type), key++));
            info.push(this.renderInfoItem(Localization.get("from_name"), item.relation.source["concept/preferredLabel"], key++));
            info.push(this.renderInfoItem(Localization.get("from_id"), item.relation.source["concept/id"], key++));
            info.push(this.renderInfoItem(Localization.get("from_type"), item.relation.source["concept/type"], key++));
            info.push(this.renderInfoItem(Localization.get("to_name"), item.relation.target["concept/preferredLabel"], key++));
            info.push(this.renderInfoItem(Localization.get("to_id"), item.relation.target["concept/id"], key++));
            info.push(this.renderInfoItem(Localization.get("to_type"), item.relation.target["concept/type"], key++));
            info.push(this.renderInfoItem(Localization.get("relation_type"), item.relation["relation-type"], key++));
            // TODO: info.push(this.renderInfoItem(Localization.get("relation_weight"), "[relationsvikt]", key++));
        }
        info.push(this.renderInfoItem(Localization.get("note"), item.comment, key++));
        return info;
    }

    renderHistoryDialog() {
        var info = null;
        info = this.renderHistoryShowItem(this.state.selected);
        return (
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

    renderItem(item, simple) {
        var comment = "";
        var event = Localization.get(item.event);
        if(item.relation) {
            if(item.event == "CREATED") {
                event = Localization.get("relation_created");
            } else if(item.event == "DEPRECATED") {
                event = Localization.get("relation_removed");
            } else {
                event = Localization.get("relation_updated");
            }
        }
        if(!simple) {
            if(item.concept) {
                item.concept["concept/definition"];
            } else if(item.changes) {
                event = Localization.get(item.changes[0].attribute) + " " + event;
            } else if(item.relation) {
                event += " " + Localization.get("against") + " " + item.relation.target["concept/preferredLabel"];
            }
            comment = item.comment;
        }
        return (
            <div className="item_history_item" title={comment}>
                <div>
                    {new Date(item.date).toLocaleString()}
                </div>
                <div>
                    {event}
                </div>
                <div>
                    {item["user-id"]}
                </div>
            </div>
        );
    }

    renderLoader() {
        if(this.state.loadingConceptChanges || this.state.loadingRelationChanges) {
            return (<Loader/>);
        }        
    }

    render() {
        return (
            <div className="item_history">
                <List 
                    eventId={this.LIST_EVENT_ID}
                    data={this.state.data}
                    onItemSelected={this.onItemSelected.bind(this)}
                    dataRender={this.renderItem.bind(this)}>
                    {this.renderLoader()}
                </List>
                <div>
                    <Button 
                        isEnabled={this.state.selected != null}
                        text={Localization.get("show")}
                        onClick={this.onShowClicked.bind(this)}/>
                </div>
            </div>
        );
    }
	
}

export default ItemHistory;
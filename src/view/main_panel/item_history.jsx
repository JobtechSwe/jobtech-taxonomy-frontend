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
            data: [],
            selected: null,
            loadingConceptChanges: false,
            loadingRelationChanges: false,
        }
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
            data: [],
            selected: null,
            loadingConceptChanges: true,
            loadingRelationChanges: true,
        }, () => {
            if(props.item) {
                Rest.getConceptDayNotes(props.item.id, (data) => {
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
                Rest.getRelationDayNotes(props.item.id, (data) => {
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
            console.log(this.state.selected);
            EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
                title:this.renderItem(this.state.selected),
                content: this.renderHistoryDialog(),
            });
        }
    }

    onItemSelected(item) {
        this.setState({selected: item});
    }

    renderHistoryConcept(concept) {
        var keys = Object.keys(concept);
        keys.sort((a, b) => Util.sortValue(true, Localization.get(a), Localization.get(b)));
        var items = keys.map((attName, index) => {            
            return (
                <div 
                    key={index}
                    className="item_history_dialog_item">
                    <div>{Localization.get(attName)}</div>
                    <div>
                        <div>{concept[attName]}</div>
                    </div>
                </div>
            );
        });
        return (
            <div>
                <div className="item_history_dialog_head">
                    <div>Attribut</div>
                    <div>
                        <div>Värde</div>
                    </div>
                </div>
                <List>
                    {items}
                </List>
            </div>
        );
    }

    renderHistoryChanges(changes) {
        changes.sort((a, b) => Util.sortValue(true, Localization.get(a.attribute), Localization.get(b.attribute)));
        var items = changes.map((item, index) => {
            return (
                <div 
                    key={index}
                    className="item_history_dialog_item">
                    <div>{Localization.get(item.attribute)}</div>
                    <div>
                        <div>{item["new-value"]}</div>
                        <div>{item["old-value"]}</div>
                    </div>
                </div>
            );
        });
        return (
            <div>
                <div className="item_history_dialog_head">
                    <div>Attribut</div>
                    <div>
                        <div>Nytt värde</div>
                        <div>Gammalt värde</div>
                    </div>
                </div>
                <List>
                    {items}
                </List>
            </div>
        );
    }

    renderHistoryRelation(relation) {
        var index = 0;
        var items = [];
        items.push(<div
            key={index++}
            className="item_history_dialog_item">
            <div>{Localization.get("from")}</div>
            <div>
                <div>{relation.source["concept/id"]}</div>
                <div>{relation.source["concept/preferredLabel"]}</div>
            </div>
        </div>);
        items.push(<div
            key={index++}
            className="item_history_dialog_item">
            <div>{Localization.get("to")}</div>
            <div>
                <div>{relation.target["concept/id"]}</div>
                <div>{relation.target["concept/preferredLabel"]}</div>
            </div>
        </div>);
        return (
            <div>
                <div className="item_history_dialog_head">
                    <div>Attribut</div>
                    <div>
                        <div>Id</div>
                        <div>Namn</div>
                    </div>
                </div>
                <List>
                    {items}
                </List>
                <Label text={Localization.get("relation_type") + ": " + relation["relation-type"]}/>
            </div>
        );
    }

    renderHistoryDialog() {        
        var info = null;
        if(this.state.selected.concept) {
            info = this.renderHistoryConcept(this.state.selected.concept);        
        } else if(this.state.selected.changes) {
            info = this.renderHistoryChanges(this.state.selected.changes);
        } else if(this.state.selected.relation) {
            info = this.renderHistoryRelation(this.state.selected.relation);
        }
        return(
            <div className="item_history_dialog">                
                {info}
                <div>
                    <Button 
                        text={Localization.get("close")}
                        onClick={this.onCloseDialogClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    renderItem(item) {
        var event = Localization.get(item.event);
        if(item.relation) {
            event = Localization.get("relation") + " - " + event;
        }
        return(
            <div className="item_history_item">
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
            return(<Loader/>);
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
import React from 'react';
import List from '../../control/list.jsx';
import Button from '../../control/button.jsx';
import Constants from '../../context/constants.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Localization from '../../context/localization.jsx';

class ItemHistory extends React.Component { 

    constructor() {
        super();
        this.LIST_EVENT_ID = "ITEMHISTORY_LIST_ID";
        this.state = {
            data: [],
            selected: null,
        }
    }

    componentDidMount() {
        this.createData();
    }

    UNSAFE_componentWillReceiveProps(props) {
        EventDispatcher.fire(this.LIST_EVENT_ID);
        this.createData();
    }

    createData() {
        var testData = [];
        for(var i=Math.random()*9+1; i>=0; --i) {
            testData.push({
                date: new Date("2019-10-10T10:58:25.339Z") - Math.random()*1000*60*60*24*30,
                type: "Updated",
                author: "John Doe",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            });
        }
        this.setState({data: testData});
    }

    onCloseDialogClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    onShowClicked() {
        if(this.state.selected) {
            EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
                title:this.renderItem(this.state.selected),
                content: this.renderHistoryDialog(),
            });
        }
    }

    onItemSelected(item) {
        this.setState({selected: item});
    }

    renderHistoryDialog() {
        return(
            <div className="item_history_dialog">                
                <div>
                    {this.state.selected.text}
                </div>
                <div>
                    <Button 
                        text={Localization.get("close")}
                        onClick={this.onCloseDialogClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    renderItem(item) {
        return(
            <div className="item_history_item">
                <div>
                    {new Date(item.date).toLocaleString()}
                </div>
                <div>
                    {item.type}
                </div>
                <div>
                    {item.author}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="item_history">
                <List 
                    eventId={this.LIST_EVENT_ID}
                    data={this.state.data}
                    onItemSelected={this.onItemSelected.bind(this)}
                    dataRender={this.renderItem.bind(this)}/>
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
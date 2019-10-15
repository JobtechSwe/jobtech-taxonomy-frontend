import React from 'react';
import List from '../../control/list.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';

class ItemHistory extends React.Component { 

    constructor() {
        super();
        this.LIST_EVENT_ID = "ITEMHISTORY_LIST_ID";
        this.state = {
            data: [],
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
            });
        }
        this.setState({data: testData});
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
                    dataRender={this.renderItem.bind(this)}/>
            </div>
        );
    }
	
}

export default ItemHistory;
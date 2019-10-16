import React from 'react';
import List from '../../control/list.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';

class Changes extends React.Component { 

    constructor() {
        super();
        this.LIST_EVENT_ID = "CHANGES_LIST_ID";
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.createData(this.props.period);
    }

    UNSAFE_componentWillReceiveProps(props) {
        EventDispatcher.fire(this.LIST_EVENT_ID);
        this.createData(props.period);
    }

    createData() {
        var testData = [];
        for(var i=Math.random()*90+1; i>=0; --i) {
            testData.push({
                date: new Date("2019-10-16T10:58:25.339Z") - Math.random()*1000*60*60*24*30,
                type: "Updated",
                author: "John Doe",
            });
        }
        this.setState({data: testData});
    }

    renderItem(item) {
        return(
            <div className="changes_item">
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
            <div className="changes">
                <List 
                    eventId={this.LIST_EVENT_ID}
                    data={this.state.data} 
                    dataRender={this.renderItem.bind(this)}/>
            </div>
        );
    }
	
}

export default Changes;
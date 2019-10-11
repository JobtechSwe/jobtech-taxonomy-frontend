import React from 'react';
import Label from '../../control/label.jsx';
import List from '../../control/list.jsx';
import ControlUtil from '../../control/util.jsx';
import Constants from '../../context/constants.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';

class ItemHistory extends React.Component { 

    constructor() {
        super();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.createData();
    }

    UNSAFE_componentWillReceiveProps(props) {
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
                    data={this.state.data} 
                    dataRender={this.renderItem.bind(this)}/>
            </div>
        );
    }
	
}

export default ItemHistory;
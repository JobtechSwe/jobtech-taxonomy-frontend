import React from 'react';
import { VictoryBar, VictoryPie } from 'victory';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Rest from '../../context/rest.jsx';

class Content5 extends React.Component { 

    constructor() {
        super();
        //Storleken på värdeförråd mot varandra (hämta några olika)        
        this.state = {
            data3: [
            {
                x: "aaa",
                y: 10,
                label: "aaa"
            },
            {
                x: "bbb",
                y: 40,
                label: "bbb"
            },
            {
                x: "ccc",
                y: 15,
                label: "ccc"
            },
        ]};
    }

    componentDidMount() {
        Rest.getChanges(1, 2, (data) => {
            console.log(data);
            var test = [];
            for(var i=0; i<data.length; ++i) {
                console.log("kalle");
                var item = data[i];
                var obj = test.find((p) => {return p.x === item["event-type"]});
                if(obj) {
                    obj.y++;
                } else {
                    test.push({x: item["event-type"], y: 1, label: item["event-type"]});
                }
            }
            console.log(test);
            this.setState({data3: test});
        }, (status) => {
            // TODO: handle error
        });
    }

    render() {

        return (
            <div className="main_content_5">
                <div className="test1">
                    <VictoryBar 
                        data={this.state.data3}
                        x="x"
                        y="y"
                    />
                </div>
                <div className="test2">
                    <VictoryPie 
                        cornerRadius={({ datum }) => /*datum.y **/ 5}
                        innerRadius={({ datum }) => /*datum.y **/ 40}
                        data={this.state.data3}
                    />
                </div>
            </div>
        );
    }
	
}

export default Content5;
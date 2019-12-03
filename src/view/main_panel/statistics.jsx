import React from 'react';
import { VictoryBar, VictoryPie, VictoryTooltip } from 'victory';
import App from '../../context/app.jsx';
import Rest from '../../context/rest.jsx';
import Util from '../../context/util.jsx';
import Group from '../../control/group.jsx';

class Statistics extends React.Component { 

    constructor() {
        super();
        this.state = {
            statistics: {
                data: [
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
                ],
            },
        };

    }
    
    componentDidMount() {
        Rest.getChanges(1, 2, (data) => {
            var test = [];
            for(var i=0; i<data.length; ++i) {
                var item = data[i];
                var obj = test.find((p) => {return p.x === item["event-type"]});
                if(obj) {
                    obj.y++;
                } else {
                    test.push({x: item["event-type"], y: 1, label: item["event-type"]});
                }
            }
            this.setState({statistics: {data: test}});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta förändringar");
        });
        this.init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.init(props);
    }

    init(props) {
    }

    render() {
        return(
            <Group text="charts">
                <div className="main_content_4_chart">
                    <VictoryBar 
                        data={this.state.statistics.data}
                        x="x"
                        y="y"
                    />
                </div>
                <div className="main_content_4_chart">
                    <VictoryPie
                        labelComponent={<VictoryTooltip/>}
                        cornerRadius="5"
                        innerRadius="60"
                        data={this.state.statistics.data}
                    />
                </div>
            </Group>
        );
    }
}

export default Statistics;
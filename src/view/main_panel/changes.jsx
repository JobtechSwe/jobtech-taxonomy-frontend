import React from 'react';
import Label from '../../control/label.jsx';
import List from '../../control/list.jsx';
import ControlUtil from '../../control/util.jsx';
import Constants from '../../context/constants.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';

class Changes extends React.Component { 

    constructor() {
        super();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.getChanges(this.props.item);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.getChanges(props.item);
    }

    getChanges(item) {
        if(item) {
            Rest.abort();
            Rest.getChanges(item.version - 1, item.version, 0, 20, (data) => {
                this.setState({data: data});
            }, (status) => {
                // TODO: handle error
            });
        }
    }

    renderItem(item) {
        return(
            <div className="changes_item">
                <div>
                    {Localization.get(item.eventType)}
                </div>
                <div>
                    {item.version}
                </div>
                <div>
                    {Localization.get("db_" + item.concept.type)}
                </div>
                <div>
                    {item.concept.preferredLabel}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="changes">
                <List 
                    data={this.state.data} 
                    dataRender={this.renderItem.bind(this)}/>
            </div>
        );
    }
	
}

export default Changes;
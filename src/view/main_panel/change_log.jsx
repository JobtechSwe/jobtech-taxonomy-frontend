import React from 'react';
import DatePicker from 'react-datepicker';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import Changes from './changes.jsx';

class ChangeLog extends React.Component { 

    constructor() {
        super();
        this.state = {
            period: null
        };
    }

    componentDidMount() {
        console.log(this.props.period);
        this.onSideTimePeriodSelected(this.props.period);
        this.setState({
            period: this.props.period
        });
    }

    UNSAFE_componentWillReceiveProps(props) {
        console.log(props.period);
        this.onSideTimePeriodSelected(props.period);
        this.setState({
            period: props.period
        });
    }

    onSideTimePeriodSelected(period) {
        console.log(period);
        var components = [];
        var key = 0;
        components.push(
        );
        if(period) {
            components.push(
            );
        }
        this.setState({components: components});
    }

    renderGroup(){
        if(this.state.period) {
            return( 
                <Group 
                    css="changes_group"
                    text={Localization.get("changes") + " ( " + this.state.period.from.toLocaleDateString() + " - " + this.state.period.to.toLocaleDateString() + " )"}>
                    <Changes period={this.state.period}/>
                </Group>
            );
        }
    }

    render() {
        return (
            <div className="main_content_3">
                {this.renderGroup()}
            </div>
        );
    }
	
}

export default ChangeLog;
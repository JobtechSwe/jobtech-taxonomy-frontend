import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';

class OccupationNames extends React.Component { 

    constructor() {
        super();
        this.state = {
            items: []
        };
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({items: []}, () => {
            var item = props.item;
            if(item) {
                Rest.getConceptRelations(item.id, "occupation_name", Constants.RELATION_NARROWER, (data) => {
                    this.setState({items: data});
                }, () => {
    
                });
            }
        });
    }

    onItemSelected(item) {
        //console.log(item);
    }

    renderItem(item) {
        return (
            <div>
                {item.preferredLabel}
            </div>
        );
    }

    render() {
        return (
            <div className="occupation_name">
                <Label text="Yrkesbenämningar"/>
                <List 
                    css="occupation_name_list"
                    data={this.state.items}
                    dataRender={this.renderItem.bind(this)}
                    onItemSelected={this.onItemSelected.bind(this)}/>
            </div>
        );
    }
	
}

export default OccupationNames;
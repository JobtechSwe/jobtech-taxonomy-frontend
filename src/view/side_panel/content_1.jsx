import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.TYPE_LIST = 0;
        this.TYPE_SOMETHING = 1;
        this.state = {
            queryType: this.TYPE_LIST,
            detailsData: [],
            resultData: [],
        };
        this.searchReference = null;

        this.tempData = [];
    }

    componentDidMount() {
        // TODO: rest
        this.tempData = [{
              "id": "1ZPL_bQH_ATa",
              "type": "skill",
              "preferredLabel": "Structural Engineering"
            }, {
              "id": "rSKd_BLd_ACL",
              "type": "skill",
              "preferredLabel": "Skadereglering, personskadeförsäkring"
            }, {
              "id": "ZSXe_KXh_TzJ",
              "type": "skill",
              "preferredLabel": "Skatterätt"
            }, {
              "id": "hkzB_Lob_4jT",
              "type": "skill",
              "preferredLabel": "Skötsel av fordonstvätt"
            }, {
              "id": "NEGf_iWM_Ea4",
              "type": "skill",
              "preferredLabel": "Sed, texteditor"
            }, {
              "id": "FMyD_iiR_FKA",
              "type": "skill",
              "preferredLabel": "Spelförsäljning, lottredovisningsterminal (GVT+)"
            }
        ];
    }

    componentWillUnmount() {

    }

    onTypeChanged(e) {
        // TODO: query backend for type
        if(e.target.value == this.TYPE_LIST) {
            
        } else {
            
        }
        this.setState({queryType: e.target.value});
    }

    onSearchClicked() {
        var value = this.searchReference.value;
        if(value && value.length > 0) {
            
        } else {

        }
    }

    onDetailsItemSelected(item) {
        
    }

    onResultItemSelected(item) {
    }

    renderQueary() {
        return(
            <div className="sub_panel">
                <select 
                    className="sub_panel_select"
                    value={this.state.queryType}
                    onChange={this.onTypeChanged.bind(this)}>
                    <option value={this.TYPE_LIST}>Lista</option>
                    <option value={this.TYPE_SOMETHING}>Något</option>
                </select>
                <div className="sub_panel_search">
                    <input 
                        type="text"
                        ref={(x) => this.searchReference = x}/>
                    <Button 
                        text="Sök"
                        onClick={this.onSearchClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    renderDetailsItem(item) {
        return (
            <div>
                {item.preferredLabel}
            </div>
        );
    }

    renderResultItem(item) {
        return (
            <div className="content_1_result_item">
                <div>{0}</div>
                <div>{item.preferredLabel}</div>
            </div>
        );
    }

    renderDetails() {
        if(this.state.queryType != this.TYPE_LIST) {
            return (
                <div className="content_1_group">
                    <Label text="label"/>
                    <List 
                        data={this.state.detailsData}
                        dataRender={this.renderDetailsItem.bind(this)}
                        onItemSelected={this.onDetailsItemSelected.bind(this)}/>
                </div>
            );
        }
    }

    renderResult() {
        return (
            <div className="content_1_group">
                <Label text="Resultat"/>
                <List 
                    data={this.state.resultData}
                    dataRender={this.renderResultItem.bind(this)}
                    onItemSelected={this.onResultItemSelected.bind(this)}>
                    <div className="content_1_result_header">
                        <div>SSYK</div>
                        <div>Yrkesgrupp</div>
                    </div>
                </List>
            </div>
        );
    }

    render() {
        return (
            <div className="content_1">
                {this.renderQueary()}
                {this.renderDetails()}
                {this.renderResult()}
            </div>
        );
    }
	
}

export default Content1;
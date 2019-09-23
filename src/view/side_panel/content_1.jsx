import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderQueary() {
        return(
            <div className="sub_panel">
                <select>
                    <option value="opt1">Opt1</option>
                    <option value="opt2">Opt2</option>
                    <option value="opt3">Opt3</option>
                </select>
                <div>
                    <input type="text"/>
                    <Button text="Sök"/>
                </div>
            </div>
        );
    }

    renderResult() {
        return(
            <div className="sub_panel"></div>
        );
    }

    renderDetails() {
        return(
            <div className="sub_panel"></div>
        );
    }

    render() {
        return (
            <div>
                {this.renderQueary()}
                {this.renderResult()}
                {this.renderDetails()}
            </div>
        );
    }
	
}

export default Content1;
import React from 'react';
import Util from './util.jsx';
import Constants from './../context/constants.jsx';

class Group extends React.Component { 

    constructor() {
        super();
        this.state = {
            expanded: true,
        }
        this.css = "group";
    }

    onHeaderClicked() {
        this.setState({expanded: !this.state.expanded});
    }

    renderHeader() {
        return (
            <div 
                className="group_header font no_select" 
                onMouseUp={this.onHeaderClicked.bind(this)}>
                <img src={this.state.expanded ? Constants.ICON_EXPAND_UP : Constants.ICON_EXPAND_DOWN}/>
                <div>
                    {this.props.text}
                </div>
            </div>
        );
    }

    renderChildren() {
        var s = {
            display: (this.state.expanded ? "block" : "none"),
        }
        return (
            <div style={s}>
                {this.props.children}
            </div>
        );
    }

    render() {
        return (
            <div className={Util.getStyle(this)}>
                {this.renderHeader()}
                {this.renderChildren()}
            </div>
        );
    }
	
}

export default Group;
import React from 'react';
import Util from './util.jsx';
import Localization from './../context/localization.jsx';

class Loader extends React.Component { 

    constructor() {
        super();
        this.text = Localization.get("loading") + "...";
        this.css = "loader_group font";
    }

    render() {
        var text = this.props.text != null ? this.props.text : this.text;
        return (
            <div className={Util.getStyle(this)}>
                <div className="loader"/>
                <div>{text}</div>
            </div>
        );
    }
	
}

export default Loader;
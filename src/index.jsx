import React from 'react';
import ReactDOM from 'react-dom';
import Support from './support.jsx';
import Panel from './control/panel.jsx';
import Label from './control/label.jsx';
import ControlUtil from './control/util.jsx';
import SidePanel from './view/side_panel/side_panel.jsx';
import MainPanel from './view/main_panel/main_panel.jsx';

class Index extends React.Component { 

	constructor() {
        super();
        Support.init();
    }
    renderData(item) {
        return (
            <div>
                {item.preferredLabel}
            </div>
        );
    }

    render() {
        return (
            <div className="main">
                <SidePanel/>
                <MainPanel/>
            </div>
        );
    }
	
}

ReactDOM.render(<Index/>, document.getElementById('content'));
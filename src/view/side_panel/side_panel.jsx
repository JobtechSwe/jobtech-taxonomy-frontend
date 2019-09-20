import React from 'react';
import Panel from './../../control/panel.jsx';
import NavBar from './nav_bar.jsx';
import Container from './container.jsx';

class SidePanel extends React.Component { 

    constructor() {
        super();
        this.state = {
        
        };
    }

    render() {
        return (
            <Panel css="side_panel">
                <NavBar/>
                <Container/>
            </Panel>
        );
    }
	
}

export default SidePanel;
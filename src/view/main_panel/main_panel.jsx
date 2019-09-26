import React from 'react';
import Panel from './../../control/panel.jsx';
import Container from './../container.jsx';
import Constants from './../../context/constants.jsx';

class MainPanel extends React.Component { 

    render() {
        return (
            <Panel css="main_panel">
                <Container 
                    css="main_container"
                    eventId={"asd"}
                    defaultView={"someid"}
                    views={[{
                        content: (<div/>),
                        id: "someid",
                    }
                ]}/>
            </Panel>
        );
    }
	
}

export default MainPanel;
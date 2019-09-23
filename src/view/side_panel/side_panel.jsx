import React from 'react';
import Panel from './../../control/panel.jsx';
import NavBar from './nav_bar.jsx';
import Container from './../container.jsx';
import Constants from './../../context/constants.jsx';

class SidePanel extends React.Component { 

    render() {
        return (
            <Panel css="side_panel">
                <NavBar/>
                <Container 
                    css="side_container"
                    eventId={Constants.ID_SIDEPANEL_CONTAINER}
                    defaultView={Constants.SIDEPANEL_VIEW_1}
                    views={[{
                        content: (<div >1</div>),
                        id: Constants.SIDEPANEL_VIEW_1,
                    },{
                        content: (<div >2</div>),
                        id: Constants.SIDEPANEL_VIEW_2,
                    },{
                        content: (<div >3</div>),
                        id: Constants.SIDEPANEL_VIEW_3,
                    },{
                        content: (<div >4</div>),
                        id: Constants.SIDEPANEL_VIEW_4,
                    },{
                        content: (<div >5</div>),
                        id: Constants.SIDEPANEL_VIEW_5,
                    }
                ]}/>
            </Panel>
        );
    }
	
}

export default SidePanel;
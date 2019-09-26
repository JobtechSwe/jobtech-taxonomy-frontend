import React from 'react';
import Panel from './../../control/panel.jsx';
import NavBar from './nav_bar.jsx';
import Container from './../container.jsx';
import Constants from './../../context/constants.jsx';
import Content1 from './content_1.jsx';

class SidePanel extends React.Component { 

    render() {
        return (
            <Panel css="side_panel">
                <NavBar/>
                <Container 
                    css="side_container"
                    eventId={Constants.ID_SIDEPANEL_CONTAINER}
                    defaultView={Constants.WORK_MODE_1}
                    views={[{
                        content: (<Content1/>),
                        id: Constants.WORK_MODE_1,
                    },{
                        content: (<div >2</div>),
                        id: Constants.WORK_MODE_2,
                    },{
                        content: (<div >3</div>),
                        id: Constants.WORK_MODE_3,
                    },{
                        content: (<div >4</div>),
                        id: Constants.WORK_MODE_4,
                    },{
                        content: (<div >5</div>),
                        id: Constants.WORK_MODE_5,
                    }
                ]}/>
            </Panel>
        );
    }
	
}

export default SidePanel;
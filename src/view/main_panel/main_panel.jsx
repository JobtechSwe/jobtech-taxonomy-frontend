import React from 'react';
import Panel from './../../control/panel.jsx';
import Container from './../container.jsx';
import Constants from './../../context/constants.jsx';
import Content_1 from './content_1.jsx';

class MainPanel extends React.Component { 

    render() {
        return (
            <Panel css="main_panel">
                <Container 
                    css="main_container"
                    eventId={Constants.ID_MAINPANEL_CONTAINER}
                    defaultView={Constants.WORK_MODE_1}
                    views={[{
                        content: (<Content_1/>),
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

export default MainPanel;
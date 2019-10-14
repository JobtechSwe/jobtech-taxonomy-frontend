import React from 'react';
import Panel from './../../control/panel.jsx';
import Container from './../container.jsx';
import Constants from './../../context/constants.jsx';
import Content1 from './content_1.jsx';
import Content2 from './content_2.jsx';
import Content3 from './content_3.jsx';
import Content4 from './content_4.jsx';
import Content5 from './content_5.jsx';

class MainPanel extends React.Component { 

    render() {
        return (
            <Panel css="main_panel">
                <Container 
                    css="main_container"
                    eventId={Constants.ID_MAINPANEL_CONTAINER}
                    defaultView={Constants.WORK_MODE_1}
                    views={[{
                        content: (<Content1/>),
                        id: Constants.WORK_MODE_1,
                    },{
                        content: (<Content2/>),
                        id: Constants.WORK_MODE_2,
                    },{
                        content: (<Content3/>),
                        id: Constants.WORK_MODE_3,
                    },{
                        content: (<Content4/>),
                        id: Constants.WORK_MODE_4,
                    },{
                        content: (<Content5/>),
                        id: Constants.WORK_MODE_5,
                    }
                ]}/>
            </Panel>
        );
    }    
	
}

export default MainPanel;
import React from 'react';
import Rest from '../../context/rest.jsx';
import ConceptsSearch from './concepts_search.jsx';

class Content4 extends React.Component { 

    constructor() {
        super();
    }

    componentDidMount() {        
    }

    render() {
        return (
            <div className="side_content_4">
                <ConceptsSearch lockToType="ssyk-level-1 ssyk-level-2 ssyk-level-3 ssyk-level-4"/>
            </div>
        );
    }
	
}

export default Content4;
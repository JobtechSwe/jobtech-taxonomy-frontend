import React from 'react';
import ConceptsSearch from './concepts_search.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();        
    }

    render() {
        return (
            <div className="side_content_1">
                <ConceptsSearch />
            </div>
        );
    }
	
}

export default Content1;
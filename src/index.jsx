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
        this.state = {
            data: [],        
            treeView: null,
        }
        Support.init();
        this.test();
    }

    test() {
        var http = new XMLHttpRequest();
        http.onerror = () => {
            console.log("Failed", http.response);
        }
        http.onload = () => {
            var data = JSON.parse(http.response);
            this.setState({data: data});
        }
        http.open("GET", "https://cors-anywhere.herokuapp.com/http://jobtech-taxonomy-api-develop.dev.services.jtech.se/v0/taxonomy/public/concepts?type=skill", true);
        http.setRequestHeader("api-key", "2f904e245c1f5");
        //http.send();
    }

    componentDidMount() {
        // setup treeview
        var treeView = ControlUtil.createTreeView();
        treeView.onItemSelected = (item) => {
            var parent = item.parent;
            if(parent) {
                parent.removeChild(item);
            }
        };
        // setup nodes
        var root = ControlUtil.createTreeViewItem(treeView);
        root.setText("jonas item");
        root.setExpanded(true);
        for(var i=0; i<10; ++i) {
            var child = ControlUtil.createTreeViewItem(treeView);
            child.setText("child " + i);            
            root.addChild(child);
            for(var j=0;j<10;++j) {
                var child2 = ControlUtil.createTreeViewItem(treeView);
                child2.setText("child2 " + j);
                child.addChild(child2);
                if(j == 4) {
                    var child3 = ControlUtil.createTreeViewItem(treeView);
                    child3.setText("child3 ");
                    child2.addChild(child3);
                }
            }
        }
        treeView.addRoot(root);
        this.setState({treeView: treeView});
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
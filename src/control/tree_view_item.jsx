import React from 'react';
import Button from './button.jsx';

class TreeViewItem extends React.Component { 
    
    constructor(props) {
        super(props);
        this.state = {
            text: "item",
            children: [],
            expanded: false,
            selected: false,
        };
    }

    componentDidMount() {
        var pointer = this.props.pointer;
        // bind correct function pointers
        pointer.setText = this.setText.bind(this);
        pointer.addChild = this.addChild.bind(this);
        pointer.removeChild = this.removeChild.bind(this);
        pointer.setExpanded = this.setExpanded.bind(this);
        pointer.onDeselected = this.onDeselected.bind(this);
        pointer.onSelected = this.onSelected.bind(this);
        // update state with current values
        this.setState({
            text: pointer.text,
            children: pointer.children,
            expanded: pointer.expanded,
            selected: pointer.isSelected(),
        });
    }

    setText(text) {
        this.props.pointer.text = text;
        this.setState({text: text});
    }

    setExpanded(expanded) {
        this.props.pointer.expanded = expanded;
        this.setState({expanded: expanded});
    }

    addChild(child) {
        var children = this.state.children;
        child.parent = this.props.pointer;
        children.push(child);
        this.props.pointer.children = children;
        this.setState({children: children});
    }

    removeChild(item) {
        // TODO: remove
    }

    onDeselected() {
        this.setState({selected: false});
    }

    onSelected() {
        this.setState({selected: true});
    }

    onExpandClicked() {
        this.setExpanded(!this.state.expanded);
    }
    
    onSelectClicked() {
        this.props.pointer.setSelected(true);
    }

    renderOuterGuideline() {
        if(this.props.pointer.parent) {
            var pointer = this.props.pointer;
            var isLast = pointer.parent.isLastChild(pointer);
            var css = isLast ? "tree_view_l_section" : "tree_view_t_section";
            return (
                <div className={"tree_view_item_section " + css}/>
            );
        }
    }

    renderBlock() {
        if(this.props.pointer.parent) {
            return (
                <div className="tree_view_block"/>
            );
        }
    }

    renderExpanded() {
        if(this.state.children && this.state.children.length > 0) {
            return (
                <Button 
                    css="tree_view_expand" 
                    text={this.state.expanded ? "-" : "+"}
                    onClick={this.onExpandClicked.bind(this)}/>
            );
        }
    }

    renderChildren() {
        if(this.state.expanded) {
            return (
                <div className="tree_view_children">
                    {this.renderBlock()}
                    <div>
                        {this.state.children.map((item) => {
                            return item.reactType;
                        })}
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="tree_view_item">
                <div className="tree_view_content">
                    {this.renderOuterGuideline()}
                    {this.renderExpanded()}
                    <div onPointerUp={this.onSelectClicked.bind(this)} className={this.state.selected ? "tree_view_item_selected" : ""}>
                        {this.state.text}
                    </div>
                </div>
                {this.renderChildren()}  
            </div>
        );
    }
	
}

export default TreeViewItem;
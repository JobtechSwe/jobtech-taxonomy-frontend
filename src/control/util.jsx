import React from 'react';
import Hint from './hint.jsx';
import TreeViewItem from './tree_view_item.jsx';

class Util { 

    constructor() {
        this.TREEVIEW_ITEM_ID = 0;
    }

    __treeViewIsSelected(context, item) {
        return context.selected == item;
    }

    __treeViewSetSelected(context, item, selected) {
        if(this.__treeViewIsSelected(context, item)) {
            if(!selected) {
                if(context.selected.onDeselected) {
                    context.selected.onDeselected();
                }
                context.selected = null;
            }
        } else if(selected) {
            if(context.selected && context.selected.onDeselected) {
                context.selected.onDeselected();
            }
            context.selected = item;
            if(context.selected && context.selected.onSelected) {
                context.selected.onSelected();
                if(context.onItemSelected) {
                    // notify listeners of the treeview of the change
                    context.onItemSelected(item);
                }
            }
        }
    }

    __treeViewAddRoot(context, item) {
        context.roots.push(item);
    }

    createTreeView() {
        var context = {
            // members
            roots: [],
            selected: null,
            // utility
            isSelected: null,
            setSelected: null,
            // callbacks
            onItemSelected: null,
            // vtable
            addRoot: null,
            removeRoot: null,
        };
        // bind function pointers
        context.isSelected = this.__treeViewIsSelected.bind(this, context);
        context.setSelected = this.__treeViewSetSelected.bind(this, context);
        context.addRoot = this.__treeViewAddRoot.bind(this, context);
        return context;
    }

    __treeViewItemIsSelected(item) {
        return item.context.isSelected(item);
    }

    __treeViewItemIsLastChild(item, child) {
        return item.children.indexOf(child) == item.children.length - 1;
    }
    
    __treeViewItemSetText(item, text) {
        item.text = text;
    }

    __treeViewItemSetExpanded(item, expanded) {
        item.expanded = expanded;
    }
    
    __treeViewItemSetSelected(item, selected) {
        item.context.setSelected(item, selected);
    }
    
    __treeViewItemAddChild(item, child) {
        child.parent = item;
        item.children.push(child);
    }
    
    createTreeViewItem(context, data) {
        var pointer = {
            // members
            expanded: false,
            text: "item",
            parent: null,
            children: [],
            reactType: null,
            context: context,
            data: data,
            // utility
            isLastChild: null,
            isSelected: null,
            // vtable
            setText: null,
            setExpanded: null,
            setSelected: null,
            addChild: null,
            removeChild: null,
            onDeselected: null,
            onSelected: null,
        };
        // bind function pointers for temporary functions
        pointer.isSelected = this.__treeViewItemIsSelected.bind(this, pointer);
        pointer.setText = this.__treeViewItemSetText.bind(this, pointer);
        pointer.setExpanded = this.__treeViewItemSetExpanded.bind(this, pointer);
        pointer.setSelected = this.__treeViewItemSetSelected.bind(this, pointer);
        pointer.addChild = this.__treeViewItemAddChild.bind(this, pointer);
        pointer.isLastChild = this.__treeViewItemIsLastChild.bind(this, pointer);
        // store type used for mounting the pointer
        pointer.reactType = <TreeViewItem 
                                key={"kid_" + this.TREEVIEW_ITEM_ID++} 
                                pointer={pointer}/>;
        return pointer;
    }

    renderHint(control) {
        if(control.props.hint) {
            return (
                <Hint text={control.props.hint}/>
            );
        }
    }

    getStyle(control) {
        return control.props.css ? control.css + " " + control.props.css : control.css;
    }
	
}

export default new Util;
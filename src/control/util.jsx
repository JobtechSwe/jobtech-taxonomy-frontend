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
        if(context.onAllowItemSelection && !context.onAllowItemSelection(item)) {
            return;
        }   
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

    __treeViewGetSelected(context) {
        return context.selected;
    }

    __treeViewAddRoot(context, item) {
        context.roots.push(item);
    }

    __treViewRemoveRoot(context, item) {
        root.setSelected(false);
        var index = context.roots.indexOf(item);
        context.roots.splice(index, 1);
    }

    createTreeView() {
        var context = {
            // members
            roots: [],
            selected: null,
            shouldUpdateState: true,
            // utility
            isSelected: null,
            setSelected: null,
            getSelected: null,
            // callbacks
            onItemSelected: null,
            onAllowItemSelection: null,
            // vtable
            addRoot: null,
            removeRoot: null,
            clear: null,
            invalidate: null,
        };
        // bind function pointers
        context.isSelected = this.__treeViewIsSelected.bind(this, context);
        context.setSelected = this.__treeViewSetSelected.bind(this, context);
        context.getSelected = this.__treeViewGetSelected.bind(this, context);
        context.addRoot = this.__treeViewAddRoot.bind(this, context);
        context.removeRoot = this.__treViewRemoveRoot.bind(this, context);
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
    
    __treeViewItemSetShowButton(item, show) {
        item.showingButton = show;
    }
    
    __treeViewItemAddChild(item, child) {
        child.parent = item;
        child.attached = true;
        item.children.push(child);
    }
    
    createTreeViewItem(context, data) {
        var pointer = {
            // members
            attached: false,
            expanded: false,
            showingButton: true,
            text: "item",
            parent: null,
            children: [],
            reactType: null,
            context: context,
            data: data,
            // utility
            isLastChild: null,
            isSelected: null,
            refresh: null,
            // vtable
            setText: null,
            setExpanded: null,
            setSelected: null,
            setShowButton: null,
            addChild: null,
            removeChild: null,
            clear: null,
            sortChildren: null,
            onDeselected: null,
            onSelected: null,
        };
        // bind function pointers for temporary functions
        pointer.isSelected = this.__treeViewItemIsSelected.bind(this, pointer);
        pointer.isLastChild = this.__treeViewItemIsLastChild.bind(this, pointer);  
        pointer.refresh = () => {};
        pointer.setText = this.__treeViewItemSetText.bind(this, pointer);
        pointer.setExpanded = this.__treeViewItemSetExpanded.bind(this, pointer);
        pointer.setSelected = this.__treeViewItemSetSelected.bind(this, pointer);
        pointer.setShowButton = this.__treeViewItemSetShowButton.bind(this, pointer);
        pointer.addChild = this.__treeViewItemAddChild.bind(this, pointer);      
        // store type used for mounting the pointer
        pointer.reactType = <TreeViewItem 
                                key={"kid_" + this.TREEVIEW_ITEM_ID++} 
                                pointer={pointer}/>;
        return pointer;
    }

    createGroupContext() {
        return {
            // callbacks
            onLockChanged: null,
        };
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
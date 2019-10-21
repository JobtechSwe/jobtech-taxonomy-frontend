import React from 'react';

class Util {
    sortByKey(items, key, direction) {
        items.sort((a, b) => {
            return this.sortValue(direction, a[key], b[key]);
        });
        return items;
    }

    sortByCmp(items, cmp, direction) {
        items.sort((a, b) => {
            return this.sortValue(direction, cmp(a), cmp(b));
        });
        return items;
    }
    
    sortValue(direction, a, b) {
        if(direction) {
            if(a < b) return 1;
            if(a > b) return -1;
        } else {
            if(a < b) return -1;
            if(a > b) return 1;
        }
        return 0;
    }
}

export default new Util;
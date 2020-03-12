
//
// Support
//
class Support { 

    init() {
        // Add ECMA262-5 method binding if not supported natively
        //
        if (!('bind' in Function.prototype)) {
            Object.defineProperty(Function.prototype, "bind", {
                value: function(owner) {
                    var that = this;
                    if (arguments.length <= 1) {
                        return function() {
                            return that.apply(owner, arguments);
                        };
                    } else {
                        var args = Array.prototype.slice.call(arguments, 1);
                        return function() {
                            return that.apply(owner, arguments.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments)));
                        };
                    }
                }
            });
        }

        // Add ECMA262-5 string trim if not supported natively
        //
        if (!('trim' in String.prototype)) {
            Object.defineProperty(String.prototype, "trim", {
                value: function() {
                    return this.replace(/^\s+/, '').replace(/\s+$/, '');
                }
            });
        }

        // Add ECMA262-5 Array methods if not supported natively
        //
        if(!('indexOf' in Array.prototype)) {
            Object.defineProperty(Array.prototype, "indexOf", {
                value: function(find, i /*opt*/) {
                    if(i === null) {
                        i = 0;
                    }
                    if(i < 0) {
                        i += this.length;
                    }
                    if(i < 0) {
                        i = 0;
                    }
                    for(var n=this.length; i<n; i++) {
                        if(i in this && this[i] === find) {
                            return i;
                        }
                    }
                    return -1;
                }
            });
        }
        if(!('lastIndexOf' in Array.prototype)) {
            Object.defineProperty(Array.prototype, "lastIndexOf", {
                value: function(find, i /*opt*/) {
                    if(i === null) {
                        i = this.length - 1;
                    }
                    if(i < 0) {
                        i += this.length;
                    }
                    if(i > this.length - 1) {
                        i = this.length - 1;
                    }
                    for(i++; i-->0;) { /* i++ because from-argument is sadly inclusive */
                        if(i in this && this[i] === find) {
                            return i;
                        }
                    }
                    return -1;
                }
            });
        }
        if(!('forEach' in Array.prototype)) {
            Object.defineProperty(Array.prototype, "forEach", {
                value: function(action, that /*opt*/) {
                    for(var i=0, n=this.length; i<n; i++) {
                        if(i in this) {
                            action.call(that, this[i], i, this);
                        }
                    }
                }
            });
        }
        if(!('forEach' in Object.prototype)) {
            Object.defineProperty(Object.prototype, "forEach", {
                value: function(action, that) {
                    for(var i=0, n=this.length; i<n; i++) {
                        if(i in this) {
                            action.call(that, this[i], i, this);
                        }
                    }
                }
            });
        }
        if(!('map' in Array.prototype)) {
            Object.defineProperty(Array.prototype, "map", {
                value: function(mapper, that /*opt*/) {
                    var other = new Array(this.length);
                    for(var i=0, n=this.length; i<n; i++) {
                        if(i in this) {
                            other[i] = mapper.call(that, this[i], i, this);
                        }
                    }
                    return other;
                }
            });
        }
        if(!Array.prototype.find) {
            Object.defineProperty(Array.prototype, "find", {
                value: function(predicate) {
                    if(this === null) {
                        throw new TypeError('Array.prototype.find called on null or undefined');
                    }
                    if(typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }
                    var list = Object(this);
                    var length = list.length >>> 0;
                    var thisArg = arguments[1];
                    var value;
                    for (var i=0; i<length; i++) {
                        value = list[i];
                        if (predicate.call(thisArg, value, i, list)) {
                            return value;
                        }
                    }
                    return undefined;
                }
            });
        }
    }
}

export default new Support();
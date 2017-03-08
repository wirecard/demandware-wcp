/**
 *
 * <p>This script provides inheritance support and is inspired by base2 and Prototype</p>
 *
 * <p>The constructor is named <pre>init()</pre></p>
 *
 * <p>If a needs to override a method of a superclass, the overridden method can always be
 * called using</p>
 *                   <pre>this._super();</pre>
 *
 * <p>This is true for the constructor as well as for any other method.</p>
 *
 * @see http://etobi.de/blog/artikel/weiterlesen/vererbung-mit-javascript/
 *
 * @module util/Class
 */

/**
 * Base class which allows simple inheritance.
 *
 * @class module:util/Class~Class
 * @example
 * var MyClass = Class.extends({
 *     init : function(){
 *         // do some construction
 *     }
 * })
 *
 * // you can call the super class's method from within any method like this
 * ...
 *     myMethod : function(){
 *         // call 'myMethod' of super class
 *         this._super();
 *     }
 */
// Hack, because vars cannot be imported in DW, only functions
function Class() {}

(function () {
    var initializing = false;
    var fnTest = /xyz/.test(function () {}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    // this.Class = function(){};

    /**
     * Create a new sub class
     * @param  {Object} prop An object defining the members of the sub class
     * @return {Object}      The sub class
     * @instance
     */
    Class.extend = function (prop) {
        var _super = this.prototype; // eslint-disable-line no-underscore-dangle
        var prototype;
        var callback;
        var propName;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        callback = function (name, fn) {
            return function () {
                var tmp = this._super; // eslint-disable-line no-underscore-dangle
                var ret;

                // Add a new ._super() method that is the same method
                // but on the super-class
                this._super = _super[name]; // eslint-disable-line no-underscore-dangle

                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                ret = fn.apply(this, arguments);
                this._super = tmp; // eslint-disable-line no-underscore-dangle

                return ret;
            };
        };
        for (propName in prop) { // eslint-disable-line guard-for-in,no-restricted-syntax
            // Check if we're overwriting an existing function
            prototype[propName] =
                typeof prop[propName] === 'function' && typeof _super[propName] === 'function' &&
                fnTest.test(prop[propName]) ? callback(propName, prop[propName]) : prop[propName];
        }

        // The dummy class constructor
        function Class() { // eslint-disable-line no-shadow
            // All construction is actually done in the init method
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            }
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee; // eslint-disable-line no-caller,no-restricted-properties

        return Class;
    };
}());

/** @type {module:util/Class~Class} */
exports.Class = Class;

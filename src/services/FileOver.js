'use strict';


import CONFIG from './../config.json';


let {
    extend
    } = angular;


export default function __identity(FileDirective) {
    
    
    return class FileOver extends FileDirective {
        /**
         * Creates instance of {FileDrop} object
         * @param {Object} options
         * @constructor
         */
        constructor(options) {
            let extendedOptions = extend(options, {
                // Map of events
                events: {
                    $destroy: 'destroy',
                    dragleave: 'onDragLeave',
                    dragenter: 'onDragEnter',
                },
                // Name of property inside uploader._directive object
                prop: 'over',
                // Over class
                overClass: 'nv-file-over'
            });
            super(extendedOptions);
            this.enterCounter = 0;
        }
        /**
         * Adds over class
         */
        addOverClass() {
            this.element.addClass(this.getOverClass());
        }
        /**
         * Removes over class
         */
        removeOverClass() {
            this.element.removeClass(this.getOverClass());
        }
        /**
         * Returns over class
         * @returns {String}
         */
        getOverClass() {
            return this.overClass;
        }
        onDragLeave(event) {
            this.enterCounter--;
            if (this.enterCounter === 0) {
                this.removeOverClass();
            }
        }
        onDragEnter(event) {
            if (this.enterCounter === 0) {
                this.addOverClass();
            }
            this.enterCounter++;
        }

    }
}


__identity.$inject = [
    'FileDirective'
];
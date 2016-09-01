'use strict';


import CONFIG from './../config.json';


let {
    extend,
    forEach
    } = angular;


export default function __identity(FileDirective, $rootScope, $timeout) {

    function listenForBodyLeave($scope, callback) {
        let cb = $rootScope.$on('angularFileUpload.body.leave', callback);
        $scope.$on('$destroy', cb);
    }
    let lastLeftTimer;
    function enteredSomething(e) {
        if (lastLeftTimer) {
            $timeout.cancel(lastLeftTimer);
            lastLeftTimer = null;
        }
        document.body.classList.add('nv-body-file-over');
    }
    function leftSomething(e) {
        if (lastLeftTimer) {
            $timeout.cancel(lastLeftTimer);
        }
        lastLeftTimer = $timeout(() => {
            $rootScope.$emit('angularFileUpload.body.leave', e);
            document.body.classList.remove('nv-body-file-over');
            lastLeftTimer = null;
        }, 100);
    }
    angular.element(document.body).bind('dragleave', (e) => {
        if (e.target !== document.body) {
            return;
        }
        leftSomething(e);
    });
    angular.element(document.body).bind('dragover', (e) => {
        enteredSomething(e);
    });
    angular.element(document.body).bind('drop', (e) => {
        leftSomething(e);
    });

    return class FileDrop extends FileDirective {
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
                    drop: 'onDrop',
                    dragover: 'onDragOver',
                    dragleave: 'onDragLeave',
                },
                // Name of property inside uploader._directive object
                prop: 'drop'
            });
            super(extendedOptions);
            listenForBodyLeave(options.scope, () => {
                this.onDragLeftBody();
            });
        }
        /**
         * Returns options
         * @return {Object|undefined}
         */
        getOptions() {
        }
        /**
         * Returns filters
         * @return {Array<Function>|String|undefined}
         */
        getFilters() {
        }
        /**
         * Event handler
         */
        onDrop(event) {
            var transfer = this._getTransfer(event);
            if(!transfer) return;
            var options = this.getOptions();
            var filters = this.getFilters();
            this._preventAndStop(event);
            forEach(this.uploader._directives.over, this._removeOverClass, this);
            this.uploader.addToQueue(transfer.files, options, filters);
            leftSomething(event);
        }
        /**
         * Event handler
         */
        onDragOver(event) {
            var transfer = this._getTransfer(event);
            if(!this._haveFiles(transfer.types)) return;
            transfer.dropEffect = 'copy';
            this._preventAndStop(event);
            forEach(this.uploader._directives.over, this._addOverClass, this);
            enteredSomething(event);
        }
        /**
         * Event handler
         */
        onDragLeave(event) {
            if(event.currentTarget === this.element[0]) return;
            this._preventAndStop(event);
            forEach(this.uploader._directives.over, this._removeOverClass, this);
            leftSomething(event);
        }
        onDragLeftBody(event) {
            forEach(this.uploader._directives.over, this._removeOverClass, this);
        }
        /**
         * Helper
         */
        _getTransfer(event) {
            return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
        }
        /**
         * Helper
         */
        _preventAndStop(event) {
            event.preventDefault();
            event.stopPropagation();
        }
        /**
         * Returns "true" if types contains files
         * @param {Object} types
         */
        _haveFiles(types) {
            if(!types) return false;
            if(types.indexOf) {
                return types.indexOf('Files') !== -1;
            } else if(types.contains) {
                return types.contains('Files');
            } else {
                return false;
            }
        }
        /**
         * Callback
         */
        _addOverClass(item) {
            item.addOverClass();
        }
        /**
         * Callback
         */
        _removeOverClass(item) {
            item.removeOverClass();
        }
    }
}


__identity.$inject = [
    'FileDirective',
    '$rootScope',
    '$timeout',
];
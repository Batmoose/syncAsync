var EventEmitter = require('events').EventEmitter,
globalContext = this;
module.exports = function syncAsync(){
    var alreadyDone = false;
    const emitter = new EventEmitter();
    _parallel.apply(globalContext, arguments);
    return nextSync(syncAsync);
    
    function nextSync(callback){
        return function(){
            const nextSyncArgs = arguments;
            emitter.once('done', callbackWithArgs);
            if(alreadyDone)
                callbackWithArgs();
            function callbackWithArgs(){
                callback.apply(globalContext, nextSyncArgs);
            }
        };
    }
    function _parallel(){
        const args = Array.prototype.slice.call(arguments),
        counter = _countify(arguments.length, function(){
            emitter.emit('done');
            alreadyDone = true;
        });
        args.forEach(function(fn){
            if(typeof fn === 'function'){
                const increment = _countify(1, counter); //insures that counter will only increment once per "fn"
                process.nextTick(function(){
                    fn(increment);
                });
            }
        });
    }
    
    /*
    * Will return a function that can be executed i times,
    * callback is called the last time. Nothing happens
    * if executed more than i times.
    */
    function _countify(i, callback){
        const def = function(){return;};
        callback = callback || def;
        return function(fn){
            if(i > 0){
                (fn || def)(); i--;
            }
            if(i == 0){
                callback();
            }
        };
    }
};

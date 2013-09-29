var EventEmitter = require('events').EventEmitter,
globalContext = this;
module.exports = function syncAsync(){
    const firstEmitter = new EventEmitter(),
    firstVarFn = _variablify(true);
    return aux(firstEmitter, firstVarFn).apply(globalContext, arguments);
    
    function aux(anEmitter, varFn){
        const newVarFn = _variablify(false),
        newEmitter = new EventEmitter(),
        next = nextSync(parallel(newEmitter, newVarFn), anEmitter, varFn);
        return function(){
            next.apply(globalContext, arguments);
            return aux(newEmitter, newVarFn);
        };
    }
    function parallel(anEmitter, done){
        return function(){
            const args = Array.prototype.slice.call(arguments),
            counter = _countify(arguments.length, function(){
                console.log('finished executing');
                anEmitter.emit('done');
                done(true);
            });
            args.forEach(function(fn){
                if(typeof fn === 'function'){
                    const increment = _countify(1, counter); //insures that counter will only increment once per "fn"
                    process.nextTick(function(){
                        fn(increment);
                    });
                }
            });
        };
    }
    function nextSync(after, anEmitter, done){
        return function(){
            const nextSyncArgs = arguments;
            anEmitter.once('done', callbackWithArgs);
            if(done())
                callbackWithArgs();
            function callbackWithArgs(){
                after.apply(globalContext, nextSyncArgs);
            }
        };
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
                (fn || def)();
            }
            i--;
            if(i === 0){
                callback();
            }
        };
    }
    function _variablify(currentVal){
        return function(newVal){
            if(newVal)
               currentVal = newVal;
            return currentVal;
        };
    }
};

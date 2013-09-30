var EventEmitter = require('events').EventEmitter,
globalContext = this;
module.exports = function syncAsync(){
    const stepper = nextSync,
    onDone = parallel,
    getNext = function(newEmitter, newVarFn, anEmitter, varFn, counter){
        return stepper(onDone(newEmitter, newVarFn, counter), anEmitter, varFn);
    }
    return aux(new EventEmitter(), _variablify(true)).apply(globalContext, arguments);
    
    function aux(anEmitter, varFn, counter){
        const newVarFn = _variablify(false),
        newEmitter = new EventEmitter(),
        next = getNext(newEmitter, newVarFn, anEmitter, varFn, counter);
        return function(){
            next.apply(globalContext, arguments);
            return aux(newEmitter, newVarFn, counter);
        };
    }
    function parallel(anEmitter, done, passedCounter){
        return function(){
            const args = Array.prototype.slice.call(arguments),
            counter = _countify(arguments.length, 
             passedCounter ? function(){
                anEmitter.emit('done');
                done(true);
                passedCounter();
            } : function(){
                anEmitter.emit('done');
                done(true);
            }),
            varInnerAux = _variablify(aux(new EventEmitter(), _variablify(true), counter));
            args.forEach(function(fn){
                if(typeof fn === 'function'){
                    const increment = _countify(1, counter); //insures that counter will only increment once per "fn"
                    process.nextTick(function(){
                        fn(increment);
                    });
                }else if(fn.constructor === Array){
                    varInnerAux(varInnerAux().apply(globalContext, fn));
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
    
    /*
    * Will return a function that, when executed without
    * arguments, returns currentVal. If an argument is
    * passed, currentVal will be set to the value of the
    * argument.
    */
    function _variablify(currentVal){
        return function(newVal){
            if(newVal)
               currentVal = newVal;
            return currentVal;
        };
    }
};

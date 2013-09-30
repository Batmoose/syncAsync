syncAsync
=========
###Usage
####syncAsync executes groups of functions in parallel, and chains multiple such groups in series.

****
######In the examples below, letters represent functions. Each function is passed function `done` which is executed once.  
For example:

    function a(done){
        setTimeout(function(){
            //some stuff
            done();    
        }, 1000);
    }


####Parallel
`sAs(a, b, c)`  
`sAs([a,b,c])`
> `a`, `b`, and `c` will execute at the same time.

####Series
`sAs(a)(b)(c)`  
`sAs([a],[b],[c])`
> once `a` completes, `b` will procede, and so on...  

#####For Arrays
Arrays can be nested within one call:  
`sAs([a,b,c],[d,e,f],[g,h,i])`
> the first group (`a`, `b`, `c`) will execute in parallel. After it finishes, the next group will execute in the same manner.

Any dimension of arrays is acceptable  
`sAs([[a,b,c],[d,e,f],[g,h,i]])`

> same as above

Using arrays and plain functions together works too  
`sAs([a,b,c],[d,e,f], g)`
> the first and second array of functions will execute sequentially, `g` will not wait for both to finish before executing.

####Together!
`sAs(a)(b,[c,d],[e,f])(g,h)` and so on, to your heart's content!

###Example

    var sAs = require('path-to-module');
    sAs(function a(done){
        setTimeout(function(){
            console.log('me second');
            done();
        },300);
    }, function b(done){
        setTimeout(function(){
            console.log('me first');
            done();
        },100);
    })
    (function c(done){
        console.log('lastly, me');
        done();
    });
    /* output: me first
               me second
               lastly, me
    */
######sAs will pass a function (`done` in the example above) which must be called **once** to signal that execution is finished.  

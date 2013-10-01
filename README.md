syncAsync
=========

####syncAsync is a light-weight control flow module that executes groups of functions in parallel and chains any number of such groups in series.

`sAs` will execute any number of functions in parallel (asynchronously) and return itself. The returned copy will wait for the previous copy to finish executing before proceeding.
###Details
* Functions passed to `sAs` are themselves passed a function. Calling this function **once** tells `sAs` that execution is complete.
* Any part of `sAs` can be safely stored in a variable for later use. Ex: `var storedForLater = sAs(a)(b,c);`
* `sAs` supports arrays of functions. If multiple arrays are sent as arguments, an array will be treated like a group. Every function within one group will execute in parallel. Each group will wait for the previous to finish before executing.

#Usage
###`sAs(a,b,c)...` ` sAs(a)(b)(c)...` and everything in between!
*Letters used in the examples below represent functions.*
####Parallel
`sAs(a, b, c)`  
`sAs([a,b,c])`
> `a`, `b`, and `c` will execute at the same time.

####Series
`sAs(a)(b)(c)`  
`sAs([a],[b],[c])`
> once `a` completes, `b` will procede, and so on...  

####Together
`sAs(a,b)(c,d,e)`

###For Arrays
######Multiple arrays can be passed within one call
`sAs([a,b,c],[d,e,f],[g,h,i])`  
> the first group (`a`, `b`, `c`) will execute in parallel. After it finishes, the next group will execute in the same manner, and so on...

######Any dimension of arrays is acceptable
`sAs([[a,b,c],[d,e,f],[g,h,i]])`  
> same as above

######Using arrays and plain functions together works too
`sAs([a,b,c],[d,e,f], g)`  
> the first and second array of functions will execute sequentially, `g` will not wait for both to finish before executing.

####Chain Away!
`sAs(a,b,c)(d)([e,f],[g,h])` and so on, to your heart's content!

##Example

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

syncAsync
=========
###Usage
######syncAsync executes groups of functions in parallel, and chains multiple such groups in series.

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
sAs will pass a function (`done` in the example above) which must be called **once** to signal that execution is finished.  

####Parallel
`sAs(a, b, c)` 
> `a`, `b`, and `c` will execute at the same time

####Series
`sAs(a)(b)(c)` 
> once `a` completes, `b` will procede, and so on...  

####Together!
`sAs(a)(b,c,d)(e,f)` and so on
> Once `a` completes, `b`, `c`, and `d` will execute in parallel. Once that group finishes, `e` and `f` are next

Any parallel/series combination is possible!
  

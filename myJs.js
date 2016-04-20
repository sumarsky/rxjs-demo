/// <reference path="typings/tsd.d.ts" />
var requestStream = Rx.Observable.just('https://api.github.com/users');

var responseStream = requestStream
    .flatMap(function (requestUrl) {
        return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
    });

responseStream.subscribe(function (response) {
    console.log(response);
    // render `response` to the DOM however you wish
});
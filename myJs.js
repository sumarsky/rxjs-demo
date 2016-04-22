/// <reference path="typings/tsd.d.ts" />

var refreshButton = document.querySelector('.refresh');
var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

var closeButton1 = document.querySelector('.close1');
var close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
// and the same logic for close2 and close3

var requestStream = refreshClickStream.startWith('startup click')
    .map(function () {
        var randomOffset = Math.floor(Math.random() * 500);
        return 'https://api.github.com/users?since=' + randomOffset;
    });

var responseStream = requestStream
    .flatMap(function (requestUrl) {
        return Rx.Observable.fromPromise($.ajax({ url: requestUrl }));
    });

var suggestion1Stream = close1ClickStream.startWith('startup click')
    .combineLatest(responseStream, function (click, listUsers) {
        return listUsers[Math.floor(Math.random() * listUsers.length)];
    })
    .merge(refreshClickStream.map(function () { return null; }))
    .startWith(null);
// and the same logic for suggestion2Stream and suggestion3Stream

suggestion1Stream.subscribe(function (suggestedUser) {
    renderSuggestion(suggestedUser, '.suggestion1');
});

function renderSuggestion(suggestedUser, selector) {
    var div_suggestion = document.querySelector(selector);
    if (suggestedUser !== null) {
        var lbl_Username = div_suggestion.querySelector('.username');
        lbl_Username.textContent = suggestedUser.login;
        var img_user = div_suggestion.querySelector('img');
        img_user.src = "";
        img_user.src = suggestedUser.avatar_url;
    }
}
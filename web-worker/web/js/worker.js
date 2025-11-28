"use strict";

var curFib = 0;

// TODO

self.postMessage('hello from the webworker')

self.onmessage = onMessage;

// **********************************

function onMessage (evt) {
	console.log('received in the webworker: ', evt.data)
}

function fib(n) {
	if (n < 2) {
		return n;
	}
	return fib(n-1) + fib(n-2);
}

"use strict";

const version = 3;
var isOnline = true;
var isLoggedIn = false;
var cacheName = `ramblings-${version}`;

var urlsToCache = {
    loggedOut : [
        "/",
        "/about",
        "/contact",
        "/login",
        "/404",
        "/offline",
        "/js/blog.js",
        "/js/home.js",
        "/js/login.js",
        "/js/add-post.js",
        "/css/styles.css",
        "/images/logo.gif",
        "/images/offline.png"
    ]
}

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("message", onMessage);

main().catch(console.error);

// ***************************

async function main() {
  console.log(`Service worker ${version} is starting...`);
  await sendMessage({ requestStatusUpdate: true });
}

async function onInstall(evt) {
  console.log(`Service worker ${version} is installed`);
  self.skipWaiting();
}

async function sendMessage(msg) {
  var allClients = await clients.matchAll({ includeUncontrolled: true });
  return Promise.all(
    allClients.map(function clientMsg(client) {
      var chan = new MessageChannel();
      chan.port1.onmessage = onMessage;
      return client.postMessage(msg, [chan.port2]);
    })
  );
}

function onMessage({ data }) {
  if (data?.statusUpdate) {
    ({ isOnline, isLoggedIn } = data.statusUpdate);
    console.log(`service worker version${version} isOnline:${isOnline} , isLoggedIn:${isLoggedIn}`)
  }
}

function onActivate(evt) {
  evt.waitUntil(handleActivation()); // gets a promise
}

async function handleActivation() {
  await clients.claim();
  console.log(`Service worker ${version} is activated`);
}

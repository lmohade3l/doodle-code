(function Blog() {
  "use strict";

  var offlineIcon;
  var isOnline = "onLine" in navigator ? navigator.onLine : true;
  var isLoggedIn = /isLoggedIn=1/.test(document.cookie.toString() || "");
  var usingSw = "serviceWorker" in navigator;
  var swRegistration;
  var svcworker;

  document.addEventListener("DOMContentLoaded", ready, false);
  initServiceWorker().catch(console.error);

  // **********************************

  function ready() {
    offlineIcon = document.getElementById("connectivity-status");

    if (!isOnline) {
      offlineIcon.classList.remove("hidden");
    }

    window.addEventListener("online", function online() {
      offlineIcon.classList.add("hidden");
      isOnline = true;
    });

    window.addEventListener("offline", function offline() {
      offlineIcon.classList.remove("hidden");
      isOnline = false;
    });
  }

  async function initServiceWorker() {
    swRegistration = await navigator.serviceWorker.register("/sw.js", {
      updateViaCache: "none",
    });

    svcworker =
      swRegistration.installing ||
      swRegistration.waiting ||
      swRegistration.active;

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      function onController() {
        svcworker = navigator.serviceWorker.controller;
      }
    );

    navigator.serviceWorker.addEventListener("message", onSwMessage);
  }

  function onSwMessage(evt) {
    var { data } = evt;
    if (data.requestStatusUpdate) {
      console.log("received status update request from sw");
      sendStatusUpdate(evt.ports && evt.ports[0]);
    }
  }

  function sendStatusUpdate(target) {
    sendSwMessage({statusUpddate:{ isOnline, isLoggedIn }}, target);
  }

  function sendSwMessage(msg, target) {
    if (target) {
      target.postMessage(msg);
    } else if (svcworker) {
      svcworker.postMessage(msg);
    } else {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  }
})();

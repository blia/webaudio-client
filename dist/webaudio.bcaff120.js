parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"Focm":[function(require,module,exports) {
function t(){this.socket=n,this.WIDTH=640,this.HEIGHT=480,this.canvas=document.querySelector("canvas"),this.getMicrophoneInput().then(t=>{console.log("mic connected")})}context=new(window.AudioContext||window.webkitAudioContext),t.prototype.getMicrophoneInput=function(){var t="localhost"==window.location.hostname||"127.0.0.1"==window.location.hostname;return"https:"==window.location.protocol||t||alert("HTTPS is required for microphone access, and this site has no SSL cert yet. Sorry!"),navigator.mediaDevices.getUserMedia({audio:!0}).then(this.onStream.bind(this),this.onStreamError.bind(this))},t.prototype.onStream=function(t){var e=context.createMediaStreamSource(t),o=context.createBiquadFilter();o.frequency.value=60,o.type="notch",o.Q=10;var n=context.createAnalyser();e.connect(o),o.connect(n),this.analyser=n,window.requestAnimationFrame(this.visualize.bind(this))},t.prototype.onStreamError=function(t){console.error("Error getting microphone",t)},t.prototype.visualize=function(){this.canvas.width=this.WIDTH,this.canvas.height=this.HEIGHT;var t=this.canvas.getContext("2d"),e=new Uint8Array(this.analyser.frequencyBinCount);this.analyser.getByteTimeDomainData(e),this.socket.send(128-e.reduce((t,e)=>t>e?e:t,255)),console.log(128-e.reduce((t,e)=>t>e?e:t,255));for(var o=0;o<e.length;o++){var n=e[o]/256,i=this.HEIGHT*n,r=this.HEIGHT-i-1,c=this.WIDTH/e.length;t.fillStyle="black",t.fillRect(o*c,r,1,1)}window.requestAnimationFrame(this.visualize.bind(this))};const e=document.querySelector("#wsButton"),o=document.querySelector("#micButton");let n;e.onclick=(()=>{n&&(n.onerror=n.onopen=n.onclose=null,n.close()),n=new WebSocket(`ws://${location.host}`)}),o.onclick=(()=>{new t});
},{}]},{},["Focm"], null)
//# sourceMappingURL=/webaudio.bcaff120.map
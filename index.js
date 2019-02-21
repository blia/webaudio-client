/*
 * Copyright 2013 Boris Smus. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


 // Start off by initializing a new context.
context = new (window.AudioContext || window.webkitAudioContext)();



function MicrophoneSample() {
  this.socket = ws;
  this.WIDTH = 640;
  this.HEIGHT = 480;
  this.canvas = document.querySelector('canvas');
  this.getMicrophoneInput().then(_ => {
    console.log('mic connected');
  })

}

MicrophoneSample.prototype.getMicrophoneInput = function() {
  // TODO(smus): Remove this ugliness.
  var isLocalhost = window.location.hostname == 'localhost' ||
      window.location.hostname == '127.0.0.1';
  if (window.location.protocol != 'https:' && !isLocalhost) {
    alert('HTTPS is required for microphone access, and this site has no SSL cert yet. Sorry!');
  }
  return navigator.mediaDevices.getUserMedia({audio: true}).then(
                          this.onStream.bind(this),
                          this.onStreamError.bind(this));
};

MicrophoneSample.prototype.onStream = function(stream) {
  var input = context.createMediaStreamSource(stream);
  var filter = context.createBiquadFilter();
  filter.frequency.value = 60.0;
  filter.type = 'notch';
  filter.Q = 10.0;

  var analyser = context.createAnalyser();

  // Connect graph.
  input.connect(filter);
  filter.connect(analyser);

  this.analyser = analyser;
  // Setup a timer to visualize some stuff.
  window.requestAnimationFrame(this.visualize.bind(this));
};

MicrophoneSample.prototype.onStreamError = function(e) {
  console.error('Error getting microphone', e);
};

MicrophoneSample.prototype.visualize = function() {
  this.canvas.width = this.WIDTH;
  this.canvas.height = this.HEIGHT;
  var drawContext = this.canvas.getContext('2d');

  var times = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteTimeDomainData(times);
  this.socket.send(128 - times.reduce((acc, v) => acc > v ? v : acc, 255));
  console.log(128 - times.reduce((acc, v) => acc > v ? v : acc, 255));
  // console.log(times);
  for (var i = 0; i < times.length; i++) {
    var value = times[i];
    var percent = value / 256;
    var height = this.HEIGHT * percent;
    var offset = this.HEIGHT - height - 1;
    var barWidth = this.WIDTH/times.length;
    drawContext.fillStyle = 'black';
    drawContext.fillRect(i * barWidth, offset, 1, 1);
  }
  window.requestAnimationFrame(this.visualize.bind(this));
};

const wsButton = document.querySelector('#wsButton');
const micButton = document.querySelector('#micButton');

let ws;

wsButton.onclick = () => {
  if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
  }
  ws = new WebSocket(`ws://${location.host}`);
}

micButton.onclick = () => {
  var sample = new MicrophoneSample();
}

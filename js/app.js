let context, analyser, detektor, h1, h2;
const SAMPLE_SIZE = 4096;

function initialize() {
  let AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  analyser = context.createAnalyser();
  analyser.fftSize = SAMPLE_SIZE;

  detektor = new BeatDetektor(85, 169);

  h1 = document.querySelector('h1');
  h2 = document.querySelector('h2');

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  navigator.getUserMedia({audio: true}, function(stream) {
    let microphone = context.createMediaStreamSource(stream);
    microphone.connect(analyser);
    updateBPM();
  }, function() {});
}

function updateBPM(time) {
  let data = new Uint8Array(SAMPLE_SIZE);
  analyser.getByteFrequencyData(data);
  detektor.process(time/1000, data);

  h1.innerHTML = detektor.win_bpm_int_lo + ' BPM';
  h2.innerHTML = '(' + Math.round(detektor.quality_total / 1000).toString() + '% sure)';

  window.requestAnimationFrame(updateBPM);
}

window.addEventListener('click', initialize);

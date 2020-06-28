let btnCtrl, mic, micState, fft, amplitude;

function setup() {
  let canvas = createCanvas(windowWidth * 0.8, 500);
  background(230);
  textSize(16);
  for (let i = 0; i < 1024; i = i + 100) {
    let freq = i * 20;
    let label = freq.toString() + "Hz";
    let w = map(Math.sqrt(i), 0, Math.sqrt(1024), 0, width);
    text(label, w, height - 16);
  }

  btnCtrl = createButton("record");
  btnCtrl.mousePressed(toggleRecording);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  mic.connect(fft);


  frameRate(30);
}

function toggleRecording() {
  micState = !micState;
}

function draw() {
  if (micState) {
    let spectrum = fft.analyze();
    drawSpectrum(spectrum);
    printPitch(spectrum);
  }


}

function drawSpectrum(spectrum) {
  clearCanvas();
  drawSpec();

  function drawSpec() {
    stroke(20);
    noFill();
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      let x = map(Math.sqrt(i), 0, Math.sqrt(spectrum.length), 0, width);
      //let h = -height + map(spectrum[i], 0, 255, height, 0);
      //rect(x, height, width / spectrum.length, h);
      let h = height - 50 - map(spectrum[i], 0, 255, 0, height);
      vertex(x, h);
    }
    endShape();
  }

  function clearCanvas() {
    fill(230);
    strokeWeight(1);
    stroke(180);
    rect(0, 0, width, height - 50);
  }
}

function printPitch(spectrum) {
  let pitch = guessPitchName(spectrum);
  textSize(20);fill(20);noStroke();
  text(pitch,width/2-5,25);
}

function guessPitchName(spectrum) {
  console.log(spectrum);
  let peakFreq = getPeakFreq();
  let semiFromA4 = Math.round(12 * Math.log2(peakFreq / 440));
  let pitchNames = [
    "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3",
    "A3", "A#3", "B4", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4",
    "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5",
    "A5", "A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6"];
  let pitchName = pitchNames[24 + semiFromA4];
  return pitchName;

  function getPeakFreq() {
    let peakFreq = 0, peakVal = 0;
    for (let i = Math.floor(spectrum.length / 200); i < spectrum.length / 5; i++) {
      if (spectrum[i] > peakVal) {
        peakFreq = map(i, 0, spectrum.length, 20, 20000);
        peakVal = spectrum[i];
      }
    }
    console.log(peakVal);
    console.log(peakFreq);
    return peakFreq;
  }
}
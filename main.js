let btnCtrl, mic, micState, fft, amplitude;

function setup() {
  let canvas = createCanvas(windowWidth * 0.8, 400);
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



}

function toggleRecording() {
  micState = !micState;
}

function draw() {
  if (micState) {
    drawSpectrum();
    printPitch();
  }


}

function drawSpectrum() {
  fill(230);
  strokeWeight(1);
  stroke(180);
  rect(0, 0, width, height - 50);
  let spectrum = fft.analyze();
  //noStroke();
  stroke(20);
  noFill();
  //fill(255, 0, 255);
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

function printPitch() {
  
}
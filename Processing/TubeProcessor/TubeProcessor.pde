import processing.sound.*;
import processing.serial.*;
import controlP5.*;
import ddf.minim.*;
import ddf.minim.analysis.*;

//ControlP5 cp5;
//Knob gain;

processing.sound.FFT fft;
//AudioIn sound_audio_in;


//Minim minim;
AudioInput audio_in;
BeatDetect beat;

float[] binMagPrevious = new float[20];

//Envelope
float attackRatio;
float decayRatio;

int number_of_frequency_bands = 512;
int runtime;
float[] spectrum = new float[number_of_frequency_bands];
float globalGain = 1000;
int globalModulate = 0;       // 0 - use tube property, 1 - amplitude, 2 - brightness
color lowTubeColour;
color midTubeColour;
color highTubeColour;
int r = 11;  //Not used.
int g = 143; //Not used.
int b = 213; //Not used.

int count = 250;
int threshold = 100;

float[] tubeValues = new float[25];
float onsetGain;
int colour = 0xFF0000;

Serial myPort;
byte[] tubeVals = new byte[20]; 

float updateTube(int n, int fLB, int fUB, color colour, float gain){
  
  float attackRatioTemp, decayRatioTemp;
  
  //apply onset to Higher Frequency more generously
  //if ( n > 10) { 
  gain = gain * onsetGain * ((n+1) * 0.1);
  //}
  

  
  if(fUB < fLB){
    print("Error: fUB is smaller than fLB");
    return 0.0;
  }
  
  // Convert f to bins
  float fPerBin = 20000/number_of_frequency_bands;
  //
  int fLBBin = ceil(fLB/fPerBin);
  int fUBBin = ceil(fUB/fPerBin);
  float binAvg = 0;
  // Get average of bins
  // Would it be possible for the average to exclude outliers without eating
  // loads of processing time? Maybe some calculation of whats above the 
  // noise floor so we don't include too many bands which contain no information.
  for(int i = fLBBin; i <= fUBBin; i++){
    binAvg = binAvg + spectrum[i];
  }
  float binMag = (binAvg/(fUBBin-fLBBin+1));
  binMag = binMag * globalGain * gain;
  
  
  
  // avg out, what is this alpha value???
  //float alpha = 0.595;
  //binMag = (1-alpha) * tubeValues[n] + alpha * binMag;
  
  //Get Envelope Parameters From the UI
  if (n < 10)
  {
    attackRatioTemp = attackRatio;
    decayRatioTemp = decayRatio / 1.5;
  }
  else {
     decayRatioTemp = decayRatio;
     attackRatioTemp = attackRatio;
  }
  
  //Check the previous value to implement the envelope
  if ( binMag < binMagPrevious[n] * decayRatioTemp ){
    binMag = binMagPrevious[n] * decayRatioTemp;
  }
  else if ( binMag > binMagPrevious[n] * attackRatioTemp ){
    //Need to protect against the initial value of binMag preventing any attack
    if ( binMagPrevious[n] > 0.1 ){
      binMag = binMagPrevious[n] * attackRatioTemp;
    }
  }
  
  //update binMagPrevious with new value;
  binMagPrevious[n] = binMag;
  
  float binMagColour = binMag * 128;
  
  if (binMagColour > 255)
  {
    binMagColour = 255;
  }
  
  // Draw rectangles
  fill(colour, binMagColour);
  rect(30+(100*(n%5)), 100*(floor(n/5)+1), 50, 50);
  fill(colour);
  //text("ID: " + n, 30+(100*(n%5)), 100*(floor(n/5)+1)-30);
  //text(fLB + "-", 30+(100*(n%5)), 100*(floor(n/5)+1)-20);
  //text(fUB + "hz", 30+(100*(n%5)), 100*(floor(n/5)+1)-10);
  //text("Gain:" + gain, 30+(100*(n%5)), 100*(floor(n/5)+1));
  //text("Out:" + binMag, 30+(100*(n%5)), 100*(floor(n/5)+1)+10);
  
  /* Calculate Value to Send to Tubes, Only Sending the Magnitude
   * Colour of the tubes is defined in the arduino sketch. */
  float binMult = binMag/255.0;
  if(binMult > 1) binMult = 1;
  byte binMag_byte = (byte)floor(0xFF * binMult);
  
  if(binMag_byte == 0xFF) binMag_byte = (byte)0xFE;
  tubeVals[n] = binMag_byte;
  return binMag;
}

void setup() {
  
  frameRate(200);
  printArray(Serial.list());
  //myPort = new Serial(this, Serial.list()[3], 115200);

  size(700, 640);
  background(0);
 
 
  // Create a new instance of minim
  minim = new Minim(this);
  //Get the minim audio input
  audio_in = minim.getLineIn();
  //Create an instance of a minim FFT with the parameters of audio_in
  minim_fft = new ddf.minim.analysis.FFT(audio_in.bufferSize(), audio_in.sampleRate());
  //Set the window of the FFT (Accessing the static "NONE" as a static of the class not the object)
  minim_fft.window(ddf.minim.analysis.FFT.NONE);
  //Set the fft to provide 20 bands of equal energy for pink noise
  minim_fft.logAverages(20, 2);
  //We can now access the amplitude of each of these bands through the function
  //getBand(n) where n is the band number (0 to N-1)
  //Call minim_fft.forward(audio_in); to execute on each block.
 
  
  
  // a beat detection object song SOUND_ENERGY mode with a sensitivity of 10 milliseconds
  beat = new BeatDetect();
  beat.detectMode(BeatDetect.SOUND_ENERGY);
  beat.setSensitivity(50);
  
    
  // Create an Input stream which is routed into the Amplitude analyzer
  fft = new processing.sound.FFT(this, number_of_frequency_bands);
  sound_audio_in = new AudioIn(this, 0);
  
  
  
  //Create Frequency Bands of half an octave each
  
  
  // start the Audio Input
  sound_audio_in.start();
  
  // patch the AudioIn
  fft.input(sound_audio_in);
  
  UI_Init();
}      

void draw() { 
  
  background(0);
  fft.analyze(spectrum);
  
  //Run the minim FFT on the audio buffer
  minim_fft.forward(audio_in.mix);
  
  
  
  sound_audio_in.amp(gain.getValue() / 100.0);
 
  lowTubeColour = color(255,0,0);
  midTubeColour = color(255,0,125);
  highTubeColour = color(125,100,255);

  beat.detect(audio_in.mix);
  if ( beat.isOnset() )
  {
    onsetGain = onset_gain.getValue();
  }
  
  if ( onsetGain > 0.1 )
  {
  onsetGain = onsetGain * onset_gain_decay.getValue();
  }
  
  //Get Values for Envelope
  decayRatio = decay_ratio.getValue();
  attackRatio = attack_ratio.getValue();
  
  
  ///////////////////
  //Update Tubes
  updateTube(0, 20 , 28, lowTubeColour, 20);
  updateTube(1, 28, 40, midTubeColour, 20);
  updateTube(2, 40, 56, midTubeColour, 20);
  updateTube(3, 56, 80, midTubeColour, 20);
  updateTube(4, 80, 113, midTubeColour, 20);
  updateTube(5, 113, 160, midTubeColour, 20);
  updateTube(6, 160, 226, midTubeColour, 20);
  updateTube(7, 226, 320, midTubeColour, 20);
  updateTube(8, 320, 452, midTubeColour, 20);
  updateTube(9, 452, 640, highTubeColour, 20);
  updateTube(10, 640, 904, highTubeColour, 20);
  updateTube(11, 904, 1280, highTubeColour, 20);
  updateTube(12, 1280, 1806, highTubeColour, 20);
  updateTube(13, 1806, 2554, highTubeColour, 20);
  updateTube(14, 2554, 3612, highTubeColour, 20);
  updateTube(15, 3612, 5107, highTubeColour, 20);
  updateTube(16, 5107, 7222, highTubeColour, 20);
  updateTube(17, 7222, 10212, highTubeColour, 20);
  updateTube(18, 10212, 14440, highTubeColour, 20);
  updateTube(19, 14440, 18000, highTubeColour, 20);

  //Draw FFT
  
  for(int i = 0; i < number_of_frequency_bands; i++){
  // The result of the FFT is normalized
  // draw the line for frequency band i scaling it up by 5 to get more amplitude.
  stroke(150);
  line( i, height, i, height - spectrum[i]*height*5 );
  }
  
}


/* As far as I understand it this will write the tubes vals to the port as soon as the arduino 
 * is done outputting the previous ones. Because this runs upon receiving serial data. 
 * The arduino code must implement a continuous write to trigger this event. */
void serialEvent(Serial myPort) {
  myPort.write(tubeVals);  
  /* If colour has been updated then send colour command */
  /* For Tube Vals we need to somehow precede it with a command byte */
}

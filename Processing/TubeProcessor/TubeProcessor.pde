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
byte[] tubeVals = new byte[25]; 

float updateTube(int n, int fLB, int fUB, color colour, float gain){
  
  gain = gain * onsetGain;
  
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
  
  // avg out
  float alpha = 0.595;
  binMag = (1-alpha) * tubeValues[n] + alpha * binMag;

  //if (mousePressed == true) {
  //  if(mouseX < 625 && mouseX > 525 && mouseY > 200 && mouseY < 230) {
  //    binMag = 0;
  //  }
    
  //  if(mouseX < 625 && mouseX > 525 && mouseY > 250 && mouseY < 280) {
  //    binMag = 255;
  //  }
    
  //}

  
  if ( count == 0 )
  {
    //print("%d\n", binMag);
    count = 250;
  }
  else
  {
    count--;
  }
  
  
  float binMagColour = binMag * 128;
  
  if (binMagColour > 255)
  {
    binMagColour = 255;
  }
  
  // Draw rectangles
  fill(colour, binMagColour);
  rect(30+(100*(n%5)), 100*(floor(n/5)+1), 50, 50);
  fill(colour);
  text("ID: " + n, 30+(100*(n%5)), 100*(floor(n/5)+1)-30);
  text(fLB + "-", 30+(100*(n%5)), 100*(floor(n/5)+1)-20);
  text(fUB + "hz", 30+(100*(n%5)), 100*(floor(n/5)+1)-10);
  text("Gain:" + gain, 30+(100*(n%5)), 100*(floor(n/5)+1));
  text("Out:" + binMag, 30+(100*(n%5)), 100*(floor(n/5)+1)+10);

  //float red    = ((colour & 0x00FF0000) >> 16);
  //float green  = ((colour & 0x0000FF00) >> 8);
  //float blue   = ((colour & 0x000000FF) >> 0);
  
  //byte red_byte, green_byte, blue_byte;
  
  //if(binMag <= 255){
  //    red_byte    = byte(red   * (binMag/255));
  //    green_byte  = byte(green * (binMag/255));
  //    blue_byte   = byte(blue  * (binMag/255));
  //} else {
  //    red_byte    = byte(red);
  //    green_byte  = byte(green);
  //    blue_byte   = byte(blue);
  //}
      
  //myPort.write(red_byte);
  //myPort.write(green_byte);
  //myPort.write(blue_byte);
  
  
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
  
  frameRate(50);
  printArray(Serial.list());
  //myPort = new Serial(this, Serial.list()[3], 115200);

  size(660, 600);
  background(0);
  
  minim = new Minim(this);
  audio_in = minim.getLineIn();
  // a beat detection object song SOUND_ENERGY mode with a sensitivity of 10 milliseconds
  beat = new BeatDetect();
  beat.detectMode(BeatDetect.SOUND_ENERGY);
  beat.setSensitivity(200);
  
    
  // Create an Input stream which is routed into the Amplitude analyzer
  fft = new processing.sound.FFT(this, number_of_frequency_bands);
  sound_audio_in = new AudioIn(this, 0);
  
  
  // start the Audio Input
  sound_audio_in.start();
  
  // patch the AudioIn
  fft.input(sound_audio_in);
  
  UI_Init();
}      

void draw() { 
  
  background(0);
  fft.analyze(spectrum);
  
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
  //updateTube(int n, int fLB, int fUB, color colour, float gain)
   //row 1
  float subMag = updateTube(0, 1500, 4000, highTubeColour, 10);
  updateTube(1, 3400, 6000, highTubeColour, 30);
  float redMag = updateTube(2, 1000, 4000, highTubeColour, 15);
  float midMag = updateTube(3, 6500, 7200, highTubeColour, 30);
  float yellowMag = updateTube(4, 7000, 9500, highTubeColour, 10);
  
  // 2
  float highMag = updateTube(5, 2000, 10000, highTubeColour, 30);
  updateTube(6, 600, 1000, midTubeColour, 5);
  updateTube(7, 400, 1000, midTubeColour, 10);
  updateTube(8, 100, 200, midTubeColour, 5);
  updateTube(9, 4900, 6200, highTubeColour, 30);
  
  // 3
  updateTube(10, 2000, 3300, highTubeColour, 30);
  updateTube(11, 110, 220, midTubeColour, 4);
  updateTube(12, 30, 150, lowTubeColour, 15);
  updateTube(13, 140, 180, midTubeColour, 4);
  updateTube(14, 3500, 4000, highTubeColour, 30);
  
  //// 4
  updateTube(15, 2500, 3000, highTubeColour, 30);
  updateTube(16, 200, 450, midTubeColour, 10);
  updateTube(17, 150, 400, midTubeColour, 15);
  updateTube(18, 300, 600, midTubeColour, 10);
  updateTube(19, 2100, 2700, highTubeColour, 30);
  
  //// 5
  updateTube(20, 7000, 10000, highTubeColour, 10);
  updateTube(21, 4000, 4500, highTubeColour, 30);
  updateTube(22, 4000, 9000, highTubeColour, 15);
  updateTube(23, 6500, 7500, highTubeColour, 30);
  updateTube(24, 3000, 15000, highTubeColour, 10);
  ////updateTube(25, 600, 1000, highTubeColour, 5);
  ////updateTube(26, 750, 1200, highTubeColour, 7);
  ////updateTube(27, 600, 700, highTubeColour, 8);
  ////updateTube(28, 700, 1150, highTubeColour, 5);
  ////updateTube(29, 1500, 5500, highTubeColour, 10);
  
  for(int i = 0; i < number_of_frequency_bands; i++){
  // The result of the FFT is normalized
  // draw the line for frequency band i scaling it up by 5 to get more amplitude.
  stroke(150);
  line( i, height, i, height - spectrum[i]*height*5 );
  }
  
}

void serialEvent(Serial myPort) {
  myPort.write(tubeVals);  
  /* If colour has been updated then send colour command */
  /* For Tube Vals we need to somehow precede it with a command byte */
}

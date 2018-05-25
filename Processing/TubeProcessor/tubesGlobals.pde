/* Global Variables For Tubes */

/* == Library Objects ======================================
 * - Minim
 * - ControlP5
 *========================================================*/
Minim minim;
ControlP5 cp5;



/* == Audio Stream Variables ===============================
 * - Audio Input Object (Sound and Minim)
 * - Beat Detect Object
 * - FFT Object (Sound Library Version)
 *  - Number of Frequency Bands
 *  - Spectrum Array
 * - FFT Object (Minim Library Version)
 *  - 
 * 
 *
 *=========================================================*/
AudioInput minim_audio_in;
AudioIn sound_audio_in;
BeatDetect beaty;
processing.sound.FFT sound_fft;
//int number_of_frequency_bands = 512;
//float[] spectrum = new float[number_of_frequency_bands];
ddf.minim.analysis.FFT minim_fft;


/* == User interface Objects ===============================
 * - Gain
 *========================================================*/
Knob gain;
Knob onset_gain;
Knob onset_gain_decay;
Knob attack_ratio;
Knob decay_ratio;
//Tube Brightness Variables

#include <Boards.h>

#define USE_HSV
#include "WS2812.h"

//#define RAINBOW_MODE

#define DATA_PIN    7
#define NUM_LEDS    150
#define NUM_TUBES   20

WS2812 LED(NUM_LEDS); 

byte byteBuffer[NUM_TUBES*3];  //Think this only needs to be NUM_TUBES but we'll see
cRGB value;
cRGB z;
int i = 0;
int timer = 0;

int hsv_vals[NUM_TUBES][3] = {
  {0,255,255},
  {13,255,255},
  {26,255,255},
  {39,255,255},
  {52,255,255},
  
  {65,255,255},
  {78,255,255},
  {91,255,255},
  {104,255,255},
  {117,255,255},


  {130,255,255},
  {143,255,255},
  {156,255,255},
  {169,255,255},
  {182,255,255},

  {195,255,255},
  {208,255,255},
  {221,255,255},
  {234,255,255},
  {255,255,255},
/*
  {240,180,255},
  {240,180,255},
  {240,180,255},
  {240,180,255},
  {240,180,255}
  */
};

void setup() {
  
  LED.setOutput(DATA_PIN);  

  Serial.begin(115200);
  int hue = 0;

  for(int j = 0; j < 150; j++){
          cRGB colour;
          //hue = hueOffset + j;
          hue = j * 2;
          if ( hue == 255 )
          {
            hue = 0;
          }
          colour.SetHSV(hue, 255, 127);
            LED.set_crgb_at(j, colour);
     }

  LED.sync();
}

void requestData() {
  while (Serial.available() <= 0) {
    Serial.print('A');   // send a capital A
    delay(10);
  }
}


void loop()
{



    /* Delay while there is no data available to read */
    requestData();

    /* If we wanted to transmit colour changes from processing to the arduino,
     *  we would want a command signature byte, possibly made up of the tube 
     *  number and a command number. Depending on the command number we would 
     *  then read X more bytes which would provide the data for that command.
     *  It would be easier to update groups of tubes at a time, rather than
     *  individual. Perhaps 5/6 modifiable colours that we can program from
     *  processing, but tubes are allocated a colour to follow at compilation.
     */
     
    /* Data is available, read it and translate each byte into tube brightness */
    if(Serial.available() > 0){
          Serial.readBytes(byteBuffer, NUM_TUBES);
          for(int i = 0; i < NUM_TUBES; i++){
            unsigned int brightness = (unsigned int)byteBuffer[i];
            //Multipler is equal to contrast ratio
            //brightness = brightness * 3;
            if(brightness > 255) brightness = 255; 
            hsv_vals[i][2] = brightness; // Update brightness
          }            
        }

  int placement = 0;
  static int offset = 0;
  
  /* Prepare Colour to be sent using the LED library */
  for(int j = 0; j < NUM_TUBES; j++){
        placement = j + offset;
        if ( placement > 19 ){
          placement = placement - 20;
        }
        cRGB colour;
        colour.SetHSV(hsv_vals[j][0], hsv_vals[j][1], hsv_vals[j][2]);
        //colour.SetHSV(rand(0,255), hsv_vals[j][1], hsv_vals[j][2]);
        for(int k = 0; k < 8; k++){
          LED.set_crgb_at((8*placement)+k, colour);
        }
   }

   static int previousMillis = 0;

   //read timer
   int currentTime = millis();
   
   //Increase placement when te timer expires and handle wrap
   //if ( (currentTime < previousMillis ){
    
   if ( ( previousMillis + 500) > currentTime )
   {
      offset = offset + 7;
   }

   //stop offset from running away
   if ( offset > 19 ){
    offset = offset - 20;
   }

   //update timer
   previousMillis = millis();

  /* Send the data to the WS2812 */
  LED.sync();

}

#if 0
void commandInterpreter ( void )
{
  byte colour[2];
  
  /* Read a Byte From Serial */
  byte command_byte;
  Serial.readBytes(&command_byte, 1);

  switch (command_byte & COMMAND_BIT_MASK )
  {
  case 0: //Colour Update
    receiveColour(command_byte & MODIFIER_BIT_MASK);
    break;
  case 1: //Tube Brightness
  case 2: //Unknown Command
  case 3: //Unknown Command
  
  }
  }
  
}

void receiveColour ( int group_to_update )
{
  byte colour[3];
  
  /* Wait For Data to be available */
  request_data();
  if ( Serial.available() > 0 );
  {
    /* Read the number of bytes used to transmit a colour in RGB */
    Serial.readBytes(colour, 3);
  }
  else
  {
    /* Hang, This shouldn't be able to happen */ 
    while(1);
    return;
  }

  /* Input New Colour to the Group */
  
  
}

#endif


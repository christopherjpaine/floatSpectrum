

void UI_Init ()
{
   cp5 = new ControlP5(this); 
   gain = cp5.addKnob("gain")
               .setRange(0,200)
               .setValue(100)
               .setPosition(525,70)
               .setRadius(50)
               .setDragDirection(Knob.VERTICAL)
               ;
               
  /* Need to Add a knob for:
   * On Beat Gain;
   * No Beat Gain;
   * After Beat Decay;
   * */
   
  onset_gain = cp5.addKnob("onset_gain")
            .setRange(1,10)
            .setValue(5)
            .setPosition(525,200)
            .setRadius(50)
            .setDragDirection(Knob.VERTICAL)
            ;
               
  onset_gain_decay = cp5.addKnob("onset gain decay")
            .setRange(0.1, 0.95)
            .setValue(0.7)
            .setPosition(525,320)
            .setRadius(50)
            .setDragDirection(Knob.VERTICAL)
            ;
               
  //cp5.addBang("Dark")
  //   .setValue(0)
  //   .setPosition(525,200)
  //   .setSize(100,30)
  //   ;
  
  //cp5.addBang("Bright")
  //   .setValue(0)
  //   .setPosition(525,250)
  //   .setSize(100,30)
  //   ;
}

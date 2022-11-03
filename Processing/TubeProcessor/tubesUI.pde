

void UI_Init ()
{
   cp5 = new ControlP5(this); 
   gain = cp5.addKnob("gain")
               .setRange(0,200)
               .setValue(30)
               .setPosition(525,30)
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
            .setValue(2.1)
            .setPosition(525,150)
            .setRadius(50)
            .setDragDirection(Knob.VERTICAL)
            ;
               
  onset_gain_decay = cp5.addKnob("onset gain decay")
            .setRange(0.1, 0.99)
            .setValue(0.99)
            .setPosition(525,270)
            .setRadius(50)
            .setDragDirection(Knob.VERTICAL)
            ;
          
  decay_ratio = cp5.addKnob("Decay Ratio")
            .setRange(0.1, 0.99)
            .setValue(0.76)
            .setPosition(525, 390)
            .setRadius(50)
            .setDragDirection(Knob.VERTICAL)
            ;
             
  attack_ratio = cp5.addKnob("Attack Ratio")
  .setRange(1.5, 10)
            .setPosition(525, 510)
            
            .setValue(5)
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

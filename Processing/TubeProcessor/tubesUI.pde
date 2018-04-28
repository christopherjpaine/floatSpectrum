

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
               
  cp5.addBang("Dark")
     .setValue(0)
     .setPosition(525,200)
     .setSize(100,30)
     ;
  
  cp5.addBang("Bright")
     .setValue(0)
     .setPosition(525,250)
     .setSize(100,30)
     ;
}

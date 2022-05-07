# Install processing.org for 32-bit Pi
processingAbi=-linux-x64
wget -nc https://github.com/processing/processing4/releases/download/processing-1283-4.0b8/processing-4.0b8$processingAbi.tgz
tar zxf processing-4.0b8$processingAbi.tgz
sudo mv processing-4.0b8 /opt/
sudo ln -s /opt/processing-4.0b8/processing* /usr/local/bin/
rm processing-4.0b8$processingAbi.tgz

# Ensure java runtime is available
sudo apt-get install default-jre

# Install frame buffer libraries for running headless
sudo apt-get install xvfb libxrender1 libxtst6 libxi6

# Download dependencies and move to 
processingSketchbook=~/Code/processingSketchbook # ~/sketchbook
wget -nc http://code.compartmental.net/minim/distro/minim-2.2.2.zip
unzip minim-2.2.2.zip
mv minim $processingSketchbook/libraries/
rm minim-2.2.2.zip

wget -nc https://github.com/processing/processing-sound/releases/download/v2.3.1/sound.zip
unzip sound.zip
mv sound $processingSketchbook/libraries/
rm sound.zip

wget -nc https://github.com/sojamo/controlp5/releases/download/v2.2.6/controlP5-2.2.6.zip
unzip controlP5-2.2.6.zip 
mv controlP5 $processingSketchbook/libraries/
rm controlP5-2.2.6.zip
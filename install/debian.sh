#!/usr/bin/env bash
sudo apt-get update
sudo apt-get -y install libreoffice
sudo apt-get -y install cmake
sudo apt-get -y install libopenblas-dev
sudo apt-get -y install libx11-dev
sudo apt-get -y install libpng-dev
sudo apt-get -y install poppler-utils
sudo apt-get -y install antiword
sudo apt-get -y install unrtf
sudo apt-get -y install python-devel
sudo apt-get -y install tesseract-ocr

chmod +x ./tools/python_dependencies.sh && ./tools/python_dependencies.sh

echo "INSTALLING NODE DEPENDENCIES"
cd ../ && npm install

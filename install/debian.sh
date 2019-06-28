#!/usr/bin/env bash
sudo apt-get -y install cmake
sudo apt-get -y install libopenblas-dev
sudo apt-get -y install libx11-dev
sudo apt-get -y install libpng-dev
sudo apt-get -y install poppler-utils
sudo apt-get -y install antiword
sudo apt-get -y install unrtf
sudo apt-get -y install tesseract-ocr

chmod +x ./python_dependencies.sh && bin/python_dependencies.sh
chmof +x ./create_dir.sh && bin/create_dir.sh
#!/usr/bin/env bash
sudo apt-get update
sudo apt-get -y install cmake
sudo apt-get -y install libopenblas-dev
sudo apt-get -y install libx11-dev
sudo apt-get -y install libpng-dev
sudo apt-get -y install poppler-utils
sudo apt-get -y install antiword
sudo apt-get -y install unrtf
sudo apt-get -y install tesseract-ocr

chmod +x ./tools/python_dependencies.sh && ./tool/python_dependencies.sh
chmod +x ./tools/create_dir.sh && ./tool/create_dir.sh
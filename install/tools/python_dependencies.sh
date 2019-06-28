#!/usr/bin/env bash
echo "INSTALLING PYTHON DEPENDENCIES"
if pip list 2>&1 /dev/null | grep -q "face-recognition"
then
    echo "- Face recognition is already installed"
else
   pip install face_recognition
fi
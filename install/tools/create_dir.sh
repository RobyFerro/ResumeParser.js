#!/usr/bin/env bash
echo "CREATING TEMP AND RESULTS FOLDER"
if [ ! -d "../../results" ]
then
    mkdir -m777 ../../results
else
    echo "- Results folder is already present"
fi

if [ ! -d "../../tmp" ]
then
    mkdir -m777 ../../tmp
else
    echo "- Temp folder is already present"
fi

if [ ! -d "../../tmp/document" ]
then
    mkdir -m777 ../../tmp/document
else
    echo "- Document folder is already present"
fi

if [ ! -d "../../tmp/images" ]
then
    mkdir -m777 ../../tmp/images
else
    echo "- Images folder is already present"
fi

echo "INSTALLATION COMPLETE"



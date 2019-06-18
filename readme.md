# ResumeParser.js
Simple tool to extract data from resumes.

![ResumeParser.js](screenshot.png) 

## Requirements
* Node.js
* Libreoffice
* Python 2.7/3.*

## Installation
First clone the repository and install all dependency
```
git clone https://github.com/RobyFerro/ResumeParser.js.git
npm install
```
Enter in cloned directory and run 
```
node src/parser.js --dir <RESUMES-DIRECTORY> --export <EXPORT-RESULT-DIR>
```


### Linux dependencies
##### cmake 
###### Fedora:
    yum install cmake
###### Debian:
    apt-get install cmake
##### libopenblas-dev
OPTIONAL Install for improve CPU performance during face recognition:  
###### Fedora:
    yum install openblas-devel.x86_64
###### Debian: 
    sudo apt-get install libopenblas-dev
##### libx11 (XQuartz on OSX)
###### Fedora:
    yum install libX11-devel.x86_64
###### Debian:
    sudo apt-get install libx11-dev
##### libpng 
###### Fedora:
    yum install libpng-devel
###### Debian:
    sudo apt-get install libpng-dev
##### pdftotext 
###### Fedora: 
    yum install poppler-utils
###### Debian:
    sudo apt-get install poppler-utils
##### antiword 
###### Fedora:
    wget https://forensics.cert.org/cert-forensics-tools-release-el7.rpm
    rpm -Uvh cert-forensics-tools-release*rpm
    yum --enablerepo=forensics install antiword
###### Debian: 
    sudo apt-get install antiword
##### unrtf
###### Fedora:
    yum install unrtf
###### Debian:
    sudo apt-get install unrtf
##### tesseract 
###### Fedora:
    yum install tesseract
###### Debian:
    sudo apt-get install tesseract-ocr
    
## Python dependency:
Install face recognition dependency with
```
pip install face_recognition
```


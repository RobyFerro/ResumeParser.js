# ResumeParser.js
[![Build Status](https://travis-ci.org/RobyFerro/ResumeParser.js.svg?branch=master)](https://travis-ci.org/RobyFerro/ResumeParser.js)

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

After that you've just to go inside install folder and run (depending on your linux distro) one of two script that you will find there.

## CLI Usage

```
node src/parser.js -d <RESUMES-DIRECTORY> -eD <EXPORT-RESULT-DIR> 
```

### Options

###### -d [value] / --dir [value] : default "none"
Specific source directory. Use this option to parse multiple resumes.
###### -f [value] / --file [value] : default "none"
Used to parse single resume
###### -eD [value] / --extract-data [value] : default "as configured in config.js"
Specific an output directory. Every results will be placed here.
###### -oN [value] / --output-name [value] : default "Timestamp + random hash auto generated"
Option available only with -f/--file option. Used to specific an output file name.
###### -v / --verbose : default "false"
Show verbose information

## Server usage
ResumeParser.js includes an express web server that allow you to parse a single resume just calling an HTTP service.
To start web server just run this command in root directory:
```
npm start
```

### Available API
###### POST: [YOURDOMAIN]:3000/parse
Send a resume in this route. Return a JSON object which contains every information about it.


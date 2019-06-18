#!/usr/bin/env bash
sudo yum install wget
sudo wget https://download.documentfoundation.org/libreoffice/stable/6.1.6/rpm/x86_64/LibreOffice_6.1.6_Linux_x86-64_rpm.tar.gz
sudo tar zxvf LibreOffice_6.1.6_Linux_x86-64_rpm.tar.gz
sudo cd LibreOffice_6.1.6_Linux_x86-64_rpm/
sudo cd RPMS/
#su -c 'yum install *.rpm'
sudo yum install java
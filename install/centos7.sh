#!/usr/bin/env bash
sudo yum-config-manager --add-repo https://download.opensuse.org/repositories/home:/Alexander_Pozdnyakov/CentOS_7/
sudo rpm --import https://build.opensuse.org/projects/home:Alexander_Pozdnyakov/public_key
yum check-update
yum -y install cmake libX11-devel.x86_64 libpng-devel poppler-utils
yum -y install https://forensics.cert.org/cert-forensics-tools-release-el7.rpm
yum --enablerepo=forensics install -y antiword
yum -y install http://download-ib01.fedoraproject.org/pub/epel/7/x86_64/Packages/u/unrtf-0.21.9-8.el7.x86_64.rpm
yum -y install unrtf tesseract python-devel python2-pip
yum -y install libreoffice
pip -y install --upgrade pip
sudo rm -rf *.rpm

sudo chmod +x ./tools/python_dependencies.sh && ./tools/python_dependencies.sh
sudo chmod +x ./tools/create_dir.sh && ./tools/create_dir.sh

echo "INSTALLING NODE DEPENDENCIES"
cd ../ && npm install

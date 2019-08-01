#!/usr/bin/env bash
sudo yum-config-manager --add-repo https://download.opensuse.org/repositories/home:/Alexander_Pozdnyakov/CentOS_7/
sudo rpm --import https://build.opensuse.org/projects/home:Alexander_Pozdnyakov/public_key
yum check-update
sudo yum install -y cmake
sudo yum install -y libX11-devel.x86_64
sudo yum install -y libpng-devel
sudo yum install -y poppler-utils
sudo wget https://forensics.cert.org/cert-forensics-tools-release-el7.rpm
sudo rpm -Uvh cert-forensics-tools-release*rpm
sudo yum --enablerepo=forensics install -y antiword
sudo wget http://download-ib01.fedoraproject.org/pub/epel/7/x86_64/Packages/u/unrtf-0.21.9-8.el7.x86_64.rpm
sudo rpm -Uvh unrtf-0.21.9-8.el7.x86_64.rpm
sudo yum install unrtf
sudo yum install -y tesseract
sudo yum install -y python-devel
sudo rm -rf *.rpm

sudo chmod +x ./tools/python_dependencies.sh && ./tools/python_dependencies.sh
sudo chmod +x ./tools/create_dir.sh && ./tools/create_dir.sh

echo "INSTALLING NODE DEPENDENCIES"
cd ../ && npm install

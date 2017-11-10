#!/bin/sh

yum -y update
yum install -y epel-release

tee /etc/yum.repos.d/docker.repo <<-'EOF'
[dockerrepo]
name=Docker Repository
baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
enabled=1
gpgcheck=1
gpgkey=https://yum.dockerproject.org/gpg
EOF

yum install -y nano wget iotop htop iftop python-setuptools dstat hdparm git docker-engine
service docker start
chkconfig docker on
easy_install pip
pip install sqlparse pyyaml docker-compose
pip install --upgrade backports.ssl_match_hostname

wget https://github.com/bcicen/ctop/releases/download/v0.4.1/ctop-0.4.1-linux-amd64 -O ctop
sudo mv ctop /usr/local/bin/
sudo chmod +x /usr/local/bin/ctop
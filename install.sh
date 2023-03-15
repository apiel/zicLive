#!/bin/bash

apt update -y
apt-get update -y
apt-get upgrade -y

# if [ "$(uname -m)" = arm* ]; then
#     wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v16.3.0.sh | bash
# fi

apt-get -y install libsdl2-ttf-dev libsdl2-ttf-2.0-0 libsdl2-dev fonts-liberation2 vim git libsndfile1 libsndfile1-dev

mkdir ~/Music
cd ~/Music

git clone https://github.com/apiel/zicNode.git
cd zicNode
git clone https://github.com/apiel/zic.git
npm install
cd ..

git clone https://github.com/apiel/zicNodeUI.git
cd zicNodeUI
npm install
cd ..

git clone https://github.com/apiel/zicLive.git
cd zicLive
npm install

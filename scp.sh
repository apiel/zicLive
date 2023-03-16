#!/bin/bash

echo "Build"
npm run build

echo "Copy dist folder"
sshpass -f ./.sshpassword rsync -ru dist/* pi@192.168.1.107:Music/zicLive/dist

echo "Kill nodejs"
sshpass -f ./.sshpassword ssh pi@192.168.1.107 'killall node'

echo "Run node"
sshpass -f ./.sshpassword ssh pi@192.168.1.107 'cd Music/zicLive && node dist/main.js --server'
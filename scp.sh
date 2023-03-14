#!/bin/bash

echo "Build"
npm run build

# TODO dont clean folder and just copy modified files

echo "Kill nodejs && Clean dist folder"
sshpass -f ./.sshpassword ssh pi@192.168.1.106 'killall node && rm -rf Music/zicLive/dist'

echo "Copy dist folder"
sshpass -f ./.sshpassword scp -r dist pi@192.168.1.106:Music/zicLive

echo "Run node"
sshpass -f ./.sshpassword ssh pi@192.168.1.106 'cd Music/zicLive && node dist/main.js --server'
#!/bin/bash

echo "Build"
npm run build

echo "Clean dist folder"
sshpass -f ./.sshpassword ssh pi@192.168.1.106 'rm -rf Music/zicLive/dist'

echo "Copy dist folder"
sshpass -f ./.sshpassword scp -r dist pi@192.168.1.106:Music/zicLive

echo "Run node"
sshpass -f ./.sshpassword ssh pi@192.168.1.106 'cd Music/zicLive && node dist/main.js'
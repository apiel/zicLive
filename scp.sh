#!/bin/bash

echo "Build"
npm run build

# TODO dont clean folder and just copy modified files

echo "Kill nodejs"
sshpass -f ./.sshpassword ssh pi@192.168.1.107 'killall node'

# echo "Clean dist folder"
# sshpass -f ./.sshpassword ssh pi@192.168.1.107 'rm -rf Music/zicLive/dist'

echo "Copy dist folder"
# sshpass -f ./.sshpassword scp -r dist pi@192.168.1.107:Music/zicLive
sshpass -f ./.sshpassword rsync -ru dist/* pi@192.168.1.107:Music/zicLive/dist

echo "Run node"
sshpass -f ./.sshpassword ssh pi@192.168.1.107 'cd Music/zicLive && node dist/main.js --server'
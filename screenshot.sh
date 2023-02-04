#!/bin/sh

# unfortunately scrot doesnt work with stupid wayland...

npm run dev &
sleep 3
scrot -u -o -d 1 screenshotSequencer.png
xdotool key a+Right
scrot -u -o screenshotSeqencerEdit.png
sleep 1
xdotool key a+Down
scrot -u -o screenshotPattern.png
sleep 1
xdotool key a+Left
scrot -u -o screenshotMaster.png
sleep 1
xdotool key a+Up
scrot -u -o screenshotPatch.png
sleep 1


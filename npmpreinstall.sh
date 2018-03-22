#!/bin/sh
if [ ! -L ~/Documents/FacebookSDK ]; then
    echo 'Symlinking ~/Documents/FacebookSDK to Facebook SDK in repo'
    ln -s $(cd ./vendor/FacebookSDK; pwd) ~/Documents/FacebookSDK
fi
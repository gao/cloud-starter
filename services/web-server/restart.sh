#!/bin/ash
echo "Killing npm $(pgrep npm)"
kill -9 $(pgrep npm)
sleep .1
echo "Killing node $(pgrep node)"
kill -9 $(pgrep node)
sleep .3
echo "Running npm start.."
nohup npm start >> ./service.log 2>/dev/null 0</dev/null & 
sleep 2 
echo "done restart"
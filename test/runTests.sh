#!/bin/sh

# Small script to start the test using firefox and gather the result using nc and display them

nc -v -l localhost 10000 > log.txt &
nc_pid=$!

firefox index.html 
wait $nc_pid
cat log.txt
echo ""

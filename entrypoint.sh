#!/bin/sh -l

# Execute yargi-machine
_OUTPUT=$(yargi-machine "$@")
exit_code=$?

# Set output file
echo $_OUTPUT
echo "result=$_OUTPUT" >> $GITHUB_OUTPUT

# Pass exit code to the next step
echo "exit_code=$exit_code" >> $GITHUB_OUTPUT

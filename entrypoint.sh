#!/bin/sh -l

# Execute yargi-machine
_OUTPUT=$(eval yargi-machine $@)
exit_code=$?

echo "result<<EOF" >> $GITHUB_OUTPUT
echo "$_OUTPUT" >> $GITHUB_OUTPUT
echo "EOF" >> $GITHUB_OUTPUT

# Pass exit code to the next step
echo "exit_code=$exit_code" >> $GITHUB_OUTPUT

if [ $exit_code -ne 0 ]; then
  exit $exit_code
fi

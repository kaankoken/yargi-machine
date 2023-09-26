#!/bin/bash

# Loop through all arguments

version=""
isPrerelease=false
_type=""
_lastRelease="$(git describe --tags --abbrev=0)"

# Check if value of `lastRelease` is empty
if [ "" == "$_lastRelease" ]
then
  exit 0
fi

# Check if the value of `lastRelease` has `-rc`
if [[ "$_lastRelease" == *-rc* ]]
then
  version=$(sh "$PWD/scripts/semver.sh" bump prerelease "rc.." "$_lastRelease")
  isPrerelease=true
fi

for arg in "$@"; do
  # Check if the argument contains an equals sign (=)
  if [[ $arg == *'='* ]]; then
    # Split the argument into key and value
    key="${arg%%=*}"
    value="${arg#*=}"

    # Check if the key is `env` and the `value` is "release"
    if ([ "release" == "$value" ] && [ "$key" == "env" ]) || ([ "" == "$value" ] && [ "$key" == "env" ])
    then
      exit 0
    fi

    if [ "$key" == "lastRelease" ] && [[ "$value" != *-rc* ]]
    then
      version="$value"
    fi

    # Check if the key is `type` and the `version` is empty
    if [ "$key" == "type" ] && [ "$isPrerelease" == "false" ]
    then
      version=$(sh "$PWD/scripts/semver.sh" bump "$value" "$version")
      version="${version}-rc.1"
    fi

    if [ "$key" == "type" ]
    then
      _type="$value"
    fi
  fi
done
#result='{"type":"'"$_type"'","gitHead":"'"$gitHead"'","version":"'"$version"'","gitTag":"v'"$version"'","notes":"","channel":null}'
echo $version
echo "version=$version" >> $GITHUB_OUTPUT

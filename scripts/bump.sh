#!/bin/bash

# Loop through all arguments

version=""
isPrerelease=false
_type=""
gitHead="$(git rev-parse HEAD)"
x=""
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

    # Check if the key is `lastRelease` and the `value` is empty
    if [ "" == "$value" ] && [ "$key" == "lastRelease" ]
    then
      exit 0
    fi

    # Check if the key is `lastRelease` and the value contains `-rc`
    if [ "$key" == "lastRelease" ] && [[ "$value" == *-rc* ]]
    then
      version=$(sh "$PWD/scripts/semver.sh" bump prerelease "rc.." "$value")
      isPrerelease=true
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

    if [ "$key" == "x" ]
    then
      x="$value"
    fi
  fi
done

#result='{"type":"'"$_type"'","gitHead":"'"$gitHead"'","version":"'"$version"'","gitTag":"v'"$version"'","notes":"","channel":null}'
echo $version
echo "version=$version" >> $GITHUB_OUTPUT

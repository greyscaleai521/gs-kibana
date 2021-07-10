#!/bin/sh

# Not to be used - doesn't fix the build errors from windows file system
# and not needed when devcontainer mounts files from WSL/Linux file system

# Adapted from https://github.com/sudo-bmitch/jenkins-docker/blob/main/entrypoint.sh
# By: Brandon Mitchell <public@bmitch.net>
# License: MIT

UNAME=gsdev

# set -x

# configure script to call original entrypoint
set -- /tini -- /bin/bash "$@"

# In Prod, this may be configured with a GID already matching the container
# allowing the container to be run directly as Jenkins. In Dev, or on unknown
# environments, run the container as root to automatically correct docker
# group in container to match the docker.sock GID mounted from the host.
if [ "$(id -u)" = "0" ]; then
  # get gid of docker socket file
  if [ -e /var/run/docker.sock ] ; then
    SOCK_DOCKER_GID=`ls -ng /var/run/docker.sock | cut -f3 -d' '` 
  elif [ -e /var/run/systemd/container ] ; then
    SOCK_DOCKER_GID=`ls -ng /var/run/systemd/container  | cut -f3 -d' '` 
  fi

  # get group of gsdev user inside container
  CUR_GSDEV_GID=`getent group gsdev | cut -f3 -d: || true`

  # if they don't match, adjust
  # if [ ! -z "$SOCK_DOCKER_GID" -a "$SOCK_DOCKER_GID" != "$CUR_GSDEV_GID" ]; then
if [ "$SOCK_DOCKER_GID" != "$CUR_GSDEV_GID" ]; then
    groupmod -g ${SOCK_DOCKER_GID} -o gsdev
fi

  # Add call to gosu to drop from root user to gsdev user
  # when running original entrypoint
  set -- gosu $UNAME "$@"

fi

# replace the current pid 1 with original entrypoint
exec "$@"

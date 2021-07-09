#!/bin/sh

# Adapted from https://github.com/sudo-bmitch/jenkins-docker/blob/main/entrypoint.sh
# By: Brandon Mitchell <public@bmitch.net>
# License: MIT

UNAME=gsdev


set -x

# configure script to call original entrypoint
set -- tini -- /bin/bash "$@"

# In Prod, this may be configured with a GID already matching the container
# allowing the container to be run directly as Jenkins. In Dev, or on unknown
# environments, run the container as root to automatically correct docker
# group in container to match the docker.sock GID mounted from the host.
if [ "$(id -u)" = "0" ]; then
  # get gid of docker socket file
  SOCK_DOCKER_GID=`ls -ng /var/run/docker.sock | cut -f3 -d' '`

  # get group of docker inside container
  CUR_DOCKER_GID=`getent group docker | cut -f3 -d: || true`

  # if they don't match, adjust
  if [ ! -z "$SOCK_DOCKER_GID" -a "$SOCK_DOCKER_GID" != "$CUR_DOCKER_GID" ]; then
    groupmod -g ${SOCK_DOCKER_GID} -o docker
  fi

  # Add call to gosu to drop from root user to jenkins user
  # when running original entrypoint
  # Todo: commenting out because the root folders are not being mounted properly
  # also, check the line 28 groupmod -g above... what does that mean?
  # set -- gosu $UNAME "$@"
fi

# replace the current pid 1 with original entrypoint
exec "$@"

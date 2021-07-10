# Kibana - Greyscale

This Readme is for the custom build of Kibana to cater for specific requirements of Greyscale AI. Please look here for stock Kibana [ReadMe](README-Kibana.md).

# Development environment
A docker based development environment is recommended for set-up. Please look at the Dockerfiles into gs-dev folder within the repsitory for instructions on how to set-up the dev environment.
You will need docker enginer installed on your machine. Hto be set-up infor this custom build is catered as a set of docker images. Please install docker engine on your machine as pre-requisite. Ideally, we would have liked the entire repository and source code to be available on the local host and to be mounted as volume inside the development environment container. However, the source files on a windows host file system create a problem when building Kibana. Thus, we have configured the images to download the latest code inside them 
1. Get into working directory, and copy the docker and docker-compose files.
```bash
curl -O https://raw.githubusercontent.com/greyscaleai521/kibana/gs-dev/Dockerfile-gs.dev &&
curl -O https://raw.githubusercontent.com/greyscaleai521/kibana/gs-dev/docker-compose-gs.dev.yml
```
2. Step into kibana folder
3. Run docker-compose up for the development environment docker compose file
```bash
docker-compose -f docker-compose-gs.dev.yml up
```
4. Get into the docker container with the following command
```bash
docker exec -it gs-kibana-dev /bin/bash
```
5. You can run vscode from the current directory
```
code .
```
Any changes done to Kibana will be picked up by the Kibana instance running inside the container. Changes to the code will be saved inside the present directory.

The development environment is built using the [development Dockerfile](Dockerfile-gs.dev). Please checkout same for the pre-requisites which are installed in your development environment build image. Please also check out the [development docker compose file](docker-compose-gs.dev.yml)

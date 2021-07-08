# Kibana - Greyscale

This Readme is for the custom build of Kibana to cater for specific requirements of Greyscale AI. Please look here for stock Kibana [ReadMe](README-Kibana.md).

# Development environment
The development environment for this custom build is catered as a set of docker images. Please install docker engine on your machine and perform the following steps:
1. Clone this [repository](https://github.com/greyscaleai521/kibana.git)
2. Step into kibana folder
3. Run docker-compose up for the development environment docker compose file
```bash
docker-compose up -f docker-compose-gs.dev.yml
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
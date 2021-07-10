# Kibana - Greyscale

This Readme is for the custom build of Kibana to cater for specific requirements of Greyscale AI. Please look here for stock Kibana [ReadMe](README-Kibana.md).

# Development environment
A docker-based development environment is recommended. Look at the Dockerfiles into gs-dev folder within the repsitory for instructions on how to set-up the dev environment. 
You will need docker enginer installed on your machine. Kibana repository weighs around 4GB. Please keep around 8GB of free space in your machine. If you are using AWS, go for a machine with at least 12GB of root volume, 16GB RAM and 4 virtual CPUS. Else, "yarn kbn bootstrap" may hang.

Look into the comments of [gs-dev/Dockerfile-gs.dev](development Dockerfile) for environment set-up instructions.

# Developing on windows
You can use WSL2 with Docker Desktop and VSCode integration to perform developments fron a windows machine. Do take note to keep the gs-kibana repository on a linux filesystem.
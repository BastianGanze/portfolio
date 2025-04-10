#!/bin/bash
podman rm -f bgDb && lsof -i | grep 5444 | awk '{print $2}' | xargs kill -9

data_dir=/home/shiku/IdeaProjects/bastianganzenuxt/bastianganze/bg-db-data

podman run --network my_network --name bgDb -p 5444:5432 -d -v ${data_dir}:/var/lib/postgresql/data atsume-db
#!/bin/bash
podman rm -f bgDb && lsof -i | grep 5444 | awk '{print $2}' | xargs kill -9

data_dir=/home/shiku/IdeaProjects/bastianganzenuxt/bastianganze/bg-db-data
server=v2202401194870253208.nicesrv.de

sudo chmod 777 ${data_dir} && sudo rm -rf ${data_dir}/*

podman run --network my_network --name bgDb -p 5444:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=6JrEmGSaq2JVJgPodaLwtnDZq -e POSTGRES_DB=bgdb -d -v ${data_dir}:/var/lib/postgresql/data atsume-db

sleep 20

podman stop bgDb && lsof -i | grep 5444 | awk '{print $2}' | xargs kill -9

sudo rsync -ah --progress -e "ssh -i /home/shiku/.ssh/netcup/playground/id_rsa" root@${server}:/var/lib/podman/volumes/bg-db/* ${data_dir}/

sudo chmod 777 -R ${data_dir}/ && sudo chown 100998 -R ${data_dir}/

podman start bgDb
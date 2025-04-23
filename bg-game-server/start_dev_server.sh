podman rm -f bg-game-server && lsof -i | grep 3000 | awk '{print $2}' | xargs kill -9

data_dir=/home/shiku/IdeaProjects/bastianganzenuxt/bastianganze/bg-game-server-data
sudo rm -rf ${data_dir}/*

podman run --rm --pull always --name bg-game-server -d -p 3000:3000 -v ${data_dir}:/home/spacetime/.local/share/spacetime/data clockworklabs/spacetime start

sh publish.sh
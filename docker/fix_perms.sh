cd "${0%/*}/.."

sudo chmod 700 .
sudo chmod -R 770 ./* ./.[^.]*
sudo chown 2201 ./.env
sudo chown 2201 ./props.json

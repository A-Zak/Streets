cd /web

# try to remove the repo if it already exists
rm -rf Streets; true

git clone git@github.com:A-Zak/Streets.git

cd Streets

npm install

node .

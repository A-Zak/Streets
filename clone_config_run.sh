cd /web

# try to remove the repo if it already exists
rm -rf Streets; true

git clone https://github.com/A-Zak/Streets

cd Streets

npm install

nodejs .

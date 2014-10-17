echo "== streets == cleaning up old repo"
cd /web
rm -rf Streets; true

echo "== streets == cloning new build from https://github.com/A-Zak/Streets"
git clone https://github.com/A-Zak/Streets
cd Streets

echo "== streets == installing all dependencies"
npm install

echo "== streets == starting up"
nodejs .

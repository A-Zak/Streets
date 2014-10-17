echo "=== cleaning up old repo"
cd /web
rm -rf Streets; true

echo "=== cloning new build from https://github.com/A-Zak/Streets"
git clone https://github.com/A-Zak/Streets
cd Streets

echo "=== installing all dependencies"
npm install

echo "=== starting up"
nodejs .

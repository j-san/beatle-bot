#!/bin/bash -ex

mkdir -p dist
rm -rf dist/*

npm run build

cp -r build dist
cp -r index.html dist

node_modules/.bin/gh-pages -d dist
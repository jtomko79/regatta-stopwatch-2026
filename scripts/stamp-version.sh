#!/bin/sh
# Stamps ?v=<short sha> onto script/style links so browsers never reuse stale files.
v=$(git rev-parse --short HEAD)
for f in public/index.html public/live.html; do
  sed -i -E "s#(src=\"/?(core|excel|app|live-admin|live-view)\.js)(\?v=[^\"]*)?\"#\1?v=$v\"#g; s#(href=\"/?style\.css)(\?v=[^\"]*)?\"#\1?v=$v\"#g" "$f"
done

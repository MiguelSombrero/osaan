#!/bin/sh
set -e

# Korvaa ympäristömuuttujat Nginx-konfiguraatiossa
envsubst '\$API_URL' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "✅ Nginx configuration ready:"
cat /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'

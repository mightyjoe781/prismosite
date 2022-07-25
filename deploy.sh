#!/bin/sh
npm run build && rsync -avz --delete build/ smkroot:/var/www/prismo/
exit 0

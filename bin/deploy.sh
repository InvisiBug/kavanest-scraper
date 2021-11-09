#!/bin/sh

# yarn build && docker-compose up --build
# clear && cd helm && try { helm upgrade kavanest-scraper . --namespace kavanest --create-namespace } catch || { helm install kavanest-scraper . --namespace kavanest --create-namespace }
clear && cd helm && helm upgrade kavanest-scraper . --namespace kavanest --create-namespace

EXITCODE=$?
if [ "$EXITCODE" -ne "0" ];
then
echo "
The above error created because the deployment doesn't exist.
Creating deployment now...
"
helm install kavanest-scraper . --namespace kavanest --create-namespace
fi
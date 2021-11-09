#!/bin/sh

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
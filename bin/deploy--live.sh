#!/bin/sh

clear && cd helm && \
helm upgrade kavanest-scraper . \
--install \
--namespace kavanest \
-f values/live.yaml

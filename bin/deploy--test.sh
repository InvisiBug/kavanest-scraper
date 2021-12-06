#!/bin/sh

clear && cd helm && \
helm upgrade kavanest-test-scraper . \
--install \
--namespace kavanest-test \
-f values/test.yaml

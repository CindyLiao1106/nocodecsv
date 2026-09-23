#!/bin/bash
cd /opt/data/cad_work/nocodecsv_workspace/cite_data/raw3
> es_batch.txt
while IFS= read -r q; do
  echo "##### $q" >> es_batch.txt
  timeout 110 /opt/data/cadenv/bin/python es.py "$q" >> es_batch.txt 2>&1
  echo "" >> es_batch.txt
  sleep 6
done < q2.txt
echo ALLDONE >> es_batch.txt

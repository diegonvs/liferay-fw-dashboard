FROM openjdk:jre-alpine

ARG elastic-version=6.2.4

RUN apk add --quiet --no-progress --no-cache nodejs wget \
 && adduser -D elasticsearch

USER elasticsearch

WORKDIR /home/elasticsearch

ENV ES_TMPDIR=/home/elasticsearch/elasticsearch.tmp

RUN wget -q -O - https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-${elastic-version}.tar.gz \
 |  tar -zx \
 && mv elasticsearch-${elastic-version} elasticsearch \
 && mkdir -p ${ES_TMPDIR} 

CMD sh elasticsearch/bin/elasticsearch -E http.host=0.0.0.0

EXPOSE 9200
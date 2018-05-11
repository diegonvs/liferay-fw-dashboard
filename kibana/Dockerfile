FROM openjdk:jre-alpine

ARG elastic-version=6.2.4

RUN apk add --quiet --no-progress --no-cache nodejs wget

RUN  wget -q -O - https://artifacts.elastic.co/downloads/kibana/kibana-${elastic-version}-linux-x86_64.tar.gz \
    |  tar -zx \
    && mv kibana-${elastic-version}-linux-x86_64 kibana \
    && rm -f kibana/node/bin/node kibana/node/bin/npm \
    && ln -s $(which node) kibana/node/bin/node \
    && ln -s $(which npm) kibana/node/bin/npm

CMD sh kibana/bin/kibana --host 0.0.0.0 --elasticsearch.url=https://elasticsearch-fwdashboard.wedeploy.io:443

EXPOSE 5601

# DOCKER-VERSION 0.1.3

FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y nodejs npm git git-core

ADD clone_config_run.sh /web/
RUN chmod +x /web/clone_config_run.sh

CMD ./web/clone_config_run.sh
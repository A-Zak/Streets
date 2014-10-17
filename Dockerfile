# DOCKER-VERSION 0.1.3

FROM ubuntu:14.04
RUN apt-get update && apt-get install -y nodejs npm git git-core


ADD clone_config_run.sh /web/
RUN chmod +x /web/clone_config_run.sh
ENV PORT 5000
EXPOSE  5000

CMD ./web/clone_config_run.sh
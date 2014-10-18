# DOCKER-VERSION 1.3.0

FROM    centos:centos6

# Enable EPEL & Install Node.js and npm
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
RUN     yum install -y npm

# Copy the src and install all the dependencies
COPY . /src
RUN cd /src; npm install


ENV PORT 8080
EXPOSE  8080

# And run the app
CMD ["node", "/src/index.js"]





# ADD clone_config_run.sh /web/
# RUN chmod +x /web/clone_config_run.sh
# ENV MONGO 146.148.119.150
# ENV PORT 8080
# EXPOSE  8080

# CMD ./web/clone_config_run.sh
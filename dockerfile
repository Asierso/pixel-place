FROM ubuntu:22.04

RUN apt-get update && apt-get -y install software-properties-common ca-certificates lsb-release apt-transport-https gnupg

RUN add-apt-repository ppa:ondrej/php

RUN apt-get update && apt-get install apache2 mysql-server -y

COPY . /var/www/html

RUN echo "service mysql start && mysql -u root -e \"CREATE USER 'pixeladm'@'%' IDENTIFIED BY '1234'; GRANT ALL ON *.* TO 'pixeladm'@'%'; FLUSH PRIVILEGES; CREATE DATABASE pixelplace; USE pixelplace; CREATE TABLE pixelplace(uuid varchar(20), coordx INT, coordy INT, color varchar(11) )\"" > /tmp/setup.sh && chmod 755 /tmp/setup.sh && bash /tmp/setup.sh;

CMD ["/bin/bash","-c","apt-get install php7.4 php7.4-mysql -y && service apache2 restart && service mysql start && tail -f /dev/null"]
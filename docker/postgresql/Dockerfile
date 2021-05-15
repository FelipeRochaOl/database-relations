FROM postgres

RUN apt-get update && apt-get install -y postgresql-contrib

ADD createMultipleDatabases.sh /docker-entrypoint-initdb.d/
RUN chmod 755 /docker-entrypoint-initdb.d/createMultipleDatabases.sh

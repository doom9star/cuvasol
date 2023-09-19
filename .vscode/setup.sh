#!/bin/bash

if [ $1 = "backend" ]
then
    cd backend
    fuser -k 4000/tcp
    npm start
elif [ $1 = "frontend" ]
then
    cd frontend
    fuser -k 3000/tcp
    npm start
elif [ $1 = "mysql" ]
then
    mysql -u karthik -pkarthik cuvasol
elif [ $1 = "redis" ]
then
    redis-cli
else
    echo "REQUIRED ARG - backend|frontend"
fi

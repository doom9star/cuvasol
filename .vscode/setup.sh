#!/bin/bash

if [ $1 = "backend" ]
then
    cd backend
    npm start
elif [ $1 = "frontend" ]
then
    cd frontend
    npm start
else
    echo "REQUIRED ARG - backend|frontend"
fi

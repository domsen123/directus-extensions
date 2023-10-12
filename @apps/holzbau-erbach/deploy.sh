#!/bin/bash
BASEDIR=$(dirname "$0")
scp -r $BASEDIR/package.json www@139.162.189.147:/opt/app/erbacher-holzbau.de
scp -r $BASEDIR/dist www@139.162.189.147:/opt/app/erbacher-holzbau.de
scp -r $BASEDIR/_extensions www@139.162.189.147:/opt/app/erbacher-holzbau.de
scp -r $BASEDIR/_uploads www@139.162.189.147:/opt/app/erbacher-holzbau.de
scp -r $BASEDIR/data.sqlite3 www@139.162.189.147:/opt/app/erbacher-holzbau.de
scp -r $BASEDIR/.env www@139.162.189.147:/opt/app/erbacher-holzbau.de
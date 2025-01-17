#!/bin/bash

case "$1" in
  "start")
    echo "啟動系統..."
    docker-compose up -d
    ;;
  "stop")
    echo "停止系統..."
    docker-compose down
    ;;
  "restart")
    echo "重啟系統..."
    docker-compose down
    docker-compose up -d
    ;;
  "rebuild")
    echo "重新構建並啟動系統..."
    docker-compose down
    docker-compose up --build -d
    ;;
  *)
    echo "使用方法: ./start.sh [start|stop|restart|rebuild]"
    echo "  start   - 啟動系統"
    echo "  stop    - 停止系統"
    echo "  restart - 重啟系統"
    echo "  rebuild - 重新構建並啟動系統"
    exit 1
    ;;
esac

if [ "$1" != "stop" ]; then
  echo "系統已啟動！"
  echo "前端訪問地址: http://localhost"
  echo "後端訪問地址: http://localhost:5000"
fi 
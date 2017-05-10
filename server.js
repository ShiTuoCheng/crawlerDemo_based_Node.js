const http = require('http'); //引入http模块
const fs = require('fs'); //引入fs模块 文件 I/O
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => { //创建一个http服务器
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  if(req.url !== '/favicon.ico'){
      let out = fs.createWriteStream('./log.txt') // 创建写入流
      out.write(`请求方法：${req.method} \n`)
      out.write(`请求url：${req.url} \n`)
      out.write(`请求头对象：${JSON.stringify(req.headers, null, 4)} \n`)
      out.write(`请求http版本：${req.httpVersion} \n`)      
  }
  res.end('Hello World\n')
});

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}`)
});
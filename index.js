const cheerio = require('cheerio'); //爬虫模块
const eventproxy = require('eventproxy'); //并发模块j
const http = require('http');
const fs = require('fs'); //fs模块
const url = require('url');
const superagent = require('superagent'); //http请求模块
const cUrl = "https://cnodejs.org/"; //要爬的url cnblog

const bilibiliUrl = "http://www.bilibili.com/ranking#!/all/1/1/3/"; //B站排行榜URL
const bilibiliBaseUrl = "http://www.bilibili.com/";

//爬虫组建1
superagent.get(cUrl)
          .end((err, res) => {

            let topicUrls = [];

            if(err)
              return console.error(err);

            $ = cheerio.load(res.text);

            $('#topic_list .topic_title').each((index, element) => {
              $element = $(element);

              let href = url.resolve(cUrl, $element.attr('href'));
              topicUrls.push(href);

              console.log('正在爬取第'+ index +'个URL');
            });

            let ep = new eventproxy();

            ep.after('topic_html', topicUrls.length, (topics) => {

              topics = topics.map((topicPair) => {

                let topicUrl = topicPair[0];
                let topicHtml = topicPair[1];
                let $ = cheerio.load(topicHtml);

                let titleContent = $('.topic_full_title').text().trim(),
                    commentContent = $('.reply_content').eq(0).text().trim();
                
                return (`{
                        title: ${titleContent},
                        href: ${topicUrl},
                        comment1: ${commentContent},
                }`);
              });

              fs.appendFileSync('./content/result.json', topics, 'utf-8', err => {
                if(err)
                  throw err;

                  console.log('成功写入到json');
              });
              console.log('final:');
              console.log(topics);
            });

            topicUrls.forEach(function (topicUrl) {
              superagent.get(topicUrl)
                        .end(function (err, res) {
                          console.log('爬取页面成功 ' + topicUrl);
                          ep.emit('topic_html', [topicUrl, res.text]);
                        });
            });
  });

//爬虫中间件2
// app.get("/", (res, req, next) => {

//   let items = [];

//   superagent.get(url)
//             .end((err, sres) => {

//               // if(err)
//               //   return next(err);
              
//               $ = cheerio.load(sres);

//               $('#topic_list > a.topic_title').each((index, element) => {

//                 $elem = $(element);


//                  items.push({

//                   title: $elem.attr('title'),
//                   item_url: url+$elem.attr('href')

//                  });

//                  console.log('正在爬第'+index+'项内容');
        
//               });
//             });

//             console.log(items);
//             res.send(items);
// });

// app.listen(port, () => {
//   console.log('listen on '+port+ ' port');
// });


// const requestHandler = (request, response) => {  
//   console.log(request.url)
//   response.end(JSON.stringify({foo:"bar"}))
// }
// const server = http.createServer(requestHandler)
// server.listen(port, (err) => {  
//   if (err) {
//     return console.log('something bad happened', err)
//   }
//   console.log(`server is listening on ${port}`)
// })
	
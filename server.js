const http=require('http'),fs=require('fs'),path=require('path');
const {WebSocketServer}=require('ws');
const PORT=process.env.PORT||8080;
function page(cb){
  fs.readFile(path.join(__dirname,'index.html'),(e,d)=>{
    if(!e)return cb(null,d);
    fs.readFile(path.join(__dirname,'Dead_Zone_Ni.html'),cb)})}
const srv=http.createServer((req,res)=>{
  page((e,d)=>{
    if(e){res.writeHead(404);res.end('game html not found');return}
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(d)})});
const wss=new WebSocketServer({server:srv});
wss.on('connection',ws=>{
  ws.topics=new Set();
  ws.on('message',raw=>{
    let o;try{o=JSON.parse(raw)}catch{return}
    if(o.a==='ping'){ws.send('{"a":"pong"}');return}
    if(o.a==='sub'){if(ws.topics.size<20)ws.topics.add(o.t);return}
    if(o.a==='pub'){
      const out=JSON.stringify({a:'msg',t:o.t,m:o.m});
      for(const c of wss.clients){
        if(c!==ws&&c.readyState===1&&c.topics.has(o.t))c.send(out)}}});
});
srv.listen(PORT,'0.0.0.0',()=>console.log('listening '+PORT));

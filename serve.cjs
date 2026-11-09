// Local preview only. No dependencies, storage, or request logging.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'docs');
const port=Number(process.env.PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
  let file;
  try { const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname)); } catch {res.writeHead(400);return res.end();}
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(req.method==='HEAD'?undefined:data);});
}).listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`BMSA FSD preview: http://127.0.0.1:${port}`));

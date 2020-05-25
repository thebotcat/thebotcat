var http=require('http')
var server=http.createServer((function(request,response)
{
	fs.readFile("index.html", function(err, data){
   if(err){
      response.writeHead(404);
      response.write("Not Found!");
   }
   else{
      response.writeHead(200, {'Content-Type': contentType});
      response.write(data);
   }
   response.end();
});

server.listen(7000);

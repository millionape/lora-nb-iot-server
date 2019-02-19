const dgram = require('dgram'); 
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var thTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    //thTime = new Date(thTime);
    try {
      JSON.parse(msg);
    } catch (e) {
        console.log("this is not a json format");
        return false;
    }
    var obj = JSON.parse(msg);
    obj.dt = thTime
    //var jsonDat = {id:"1234",airTemp:"25",airHumid:"70",pm1:"50",pm25:"100",pm10:"10",rain:"1",uv:"0.04",soilHumid:"20",wind:"10",dt:thTime};
    dbo.collection("realtimeValue").insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      var res = "OK"
      server.send(res,rinfo.port,rinfo.address,function(error){
        if(error){
          client.close();
        }else{
          console.log('Data sent !!!');
        }
      });
      db.close();
    });
  });
});
server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });
  
server.bind(2888);
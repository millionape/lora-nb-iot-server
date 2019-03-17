const dgram = require('dgram'); 
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const server = dgram.createSocket('udp4');
let express = require('express')
// Initialize the app
let app = express();
// Setup server port
var port = process.env.PORT || 8080;
// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

app.get('/values', (req, res)=>{
  console.log(req.query.id);
  if ((req.query.id === undefined)|(req.query.gid === undefined)){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var query = {}
      if(req.query.id !== undefined){
        query.id = req.query.id
      }
      if(req.query.gid !== undefined){
        query.gid = req.query.gid
      }
      if(req.query.limit === undefined){
        dbo.collection("realtimeValue").find(query).sort({dt:-1}).toArray(function(err, result) {
          if (err) throw err;
          res.json(result);
          db.close();
        });
      }else{
        dbo.collection("realtimeValue").find(query).sort({dt:-1}).limit(parseInt(req.query.limit)).toArray(function(err, result) {
          if (err) throw err;
          res.json(result);
          db.close();
        });
      }
    });
  }else{
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var query = {id:req.query.id,gid:req.query.gid}
      if(req.query.limit === undefined){
        dbo.collection("realtimeValue").find(query).sort({dt:-1}).toArray(function(err, result) {
          if (err) throw err;
          res.json(result);
          db.close();
        });
      }else{
        dbo.collection("realtimeValue").find(query).sort({dt:-1}).limit(parseInt(req.query.limit)).toArray(function(err, result) {
          if (err) throw err;
          res.json(result);
          db.close();
        });
      }
    });
  }

});

// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running RestHub on port " + port);
});

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    console.log(msg);
    var arr = msg.toString().split("/").map(function (val) {
      return Number(val);
    });
    console.log(arr.length);
    if(arr.length >= 11){
      var thTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
      var jsonDat = {gid:arr[10].toString(),id:arr[0].toString(),airTemp:arr[1].toString(),airHumid:arr[2].toString(),pm1:arr[3].toString(),pm25:arr[4].toString(),pm10:arr[5].toString(),rain:arr[6].toString(),uv:arr[7].toString(),soilHumid:arr[8].toString(),wind:arr[9].toString(),dt:thTime};
      console.log(jsonDat);
      // try {
      //   JSON.parse(jsonDat);
      // } catch (e) {
      //     console.log("this is not a json format");
      //     return false;
      // }
      var obj = (jsonDat);
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
    }else{
      server.send("ERROR",rinfo.port,rinfo.address,function(error){
        if(error){
          client.close();
        }else{
          console.log('ERROR sent !!!');
          db.close();
        }
      });
    }
  });
});
server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });
  
server.bind(2888);

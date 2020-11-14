require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dns = require("dns");
const bodyParser = require("body-parser");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

var urlSchema = new mongoose.Schema({
  original: { type: String, required: true },
  short: Number
});

let Url= mongoose.model("Url",urlSchema);
let responseObject ={};
let isTrue;
function isUrl(url){
  dns.lookup(url,(err) =>{
    if(err){
      isTrue=false
       console.log(false)
      //console.log('no es')
    }else{
      isTrue=false
      console.log(true) 
      //console.log('si es wei :v');
    }
    
  })
}
  
  isUrl('vsdfasdefcvsr.com')

app.post('/api/shorturl/new',(req,res) => {
  var inputUrl =req.body.url;
   let inputShort = 1;
  var noHttps = inputUrl.replace(/^https?:\/\//,"")
   responseObject['original_url']=inputUrl;
  let urlRegex= /^(ftp|http|https):\/\/[^ "]+$/.test(inputUrl)
  if(!urlRegex){
    res.json({
      error:'invalid url'
    })
    return
  }
 
       Url.findOne({})
           .sort({short:'desc'})
           .exec((error, result) => {
         if(!error && result != undefined){
           inputShort = result.short+1;
         }
         if(!error){
           Url.findOneAndUpdate(
             {original:inputUrl},
             {original:inputUrl,short:inputShort},
             {new: true, upsert : true},
             (err,savedUrl) =>{
               if(!error){
                 responseObject['short_url'] = savedUrl.short
                 res.json(responseObject)
               }
             }
           )
         }
       })
  //var noHttps = inputUrl.replace(/^https?:\/\//,"");
})
// Your first API endpoint

app.get("/api/shorturl/:input",(req,res) =>{
  let {input}=req.params;
  Url.findOne({short:input},(error,result) => {
    if(!error && result !=undefined)
      {res.redirect(result.original)
      }else{
        res.json('Url not found')
      }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

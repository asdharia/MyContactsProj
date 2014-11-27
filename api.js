var express=require('express');
var bodyParser = require('body-parser');

//mongoose ....
var mongoose = require('mongoose');
var uristring ='mongodb://localhost:27017/contactsDB';


mongoose.connect(uristring,function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

var nextCounterSchema = new mongoose.Schema({
    _id: String,
    seq: {type: Number, default: 1}
  });
var counterRec = mongoose.model('counters', nextCounterSchema);

function doDML(dmlContact, saveContact) {
  if(dmlContact.userId){
     counterRec.findOneAndUpdate({_id:'userid'}, {'$inc':{seq:1}}, {new:true} , function(err, result) {
                                if (err){  console.log ('ERROR during upate and fetch - ' + err); }
                                   else{ 
                                         console.log('result is:'+result.seq);
                                          dmlContact.userId = parseInt(result.seq,10); 
                                          dmlContact.save(function (err) {if (err) console.log ('Error on save!')});
                                       }   
                             }); //{id:1};
   }
   else {
          dmlContact.save(function (err) {if (err) console.log ('Error on save!')});
     }
};

var userSchema = new mongoose.Schema({
  id          : { type : Number, min : 0 },
  userId      : { type : Number, min : 0 },
  firstName   : { type : String, trime:true},
  lastName    : { type : String, trime:true},
  email       : { type : String, trime:true},
  homePhone   : { type : String, trime:true},
  cellPhone   : { type : String, trime:true},
  birthday    : { type : String, trime:true},
  website     : { type : String, trime:true},
  address     : { type : String, trime:true},
});
var PUser = mongoose.model('contacts', userSchema);
//mongoose ....

//router ....
var router = express.Router();
router
     .use(function(req,res,next){      
      if(!req.user) req.user = 1;
     	next();
     })
     .use(bodyParser.json())
     .route('/contact')
          .get(function(req,res){
          	PUser.find({},'id userId firstName lastName').exec(function(err, result) {
			         if (!err) {
    		   		       console.log ('query successful'+result);
			  	           res.json(result);
		  		        } else {
				             console.log ('ERROR Record not found - '+err);
				          }
	           });
            })
          .post(function(req,res){
               var ctRec = req.body;
               ctRec.userId = req.user;
			         var newCt = new PUser ({
               id     : ctRec.userId,
               userId : ctRec.userId,
			         firstName: ctRec.firstName, 
               lastName: ctRec.lastName
			       });
			         doDML(newCt);//, newCT.save(function (err) {if (err) console.log ('Error on save!')}));
            });


router
      .param('id',function(req,res,next){
      	    req.dbQuery = { userId : parseInt(req.user.id,10)};
            next();
      })          
      .route('/contact/:id')
          .get(function(req,res) {
          	PUser.findOne(req.dbQuery,'id userId firstName lastName').exec(function(err, result) {
			  if (!err) {
    		   		       console.log (req.dbQuery+'query successful with id'+result);
			  	           res.json(result);
		  		         } else {
				                     console.log ('ERROR Record not found - '+err);
				                   };
	          });
          })
			    .put(function(req,res){
                     console.log ('in update');
				      var contact = req.body;
				      delete contact.$promise;
				      delete contact.$resolved;
                  var newcontact = req.body;
                  newcontact.userId = req.user.id;
                  var updContact = new PUser ({
                  userId : req.user.id,
                  firstName: newcontact.firstName, 
                  lastName: newcontact.lastName
                });
              PUser.update(req.dbQuery,updContact,function (err) {
                                                                     if (err) 
                                                                         console.log ('Error on Update!'+err);
                   });
			  })
			.delete(function(req,res){
                     console.log ('in delete');
				db.delete(dbQuery, function(){
					res.json(null);
				});
			});
//router ....
module.exports = router;

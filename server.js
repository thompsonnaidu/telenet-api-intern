const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const sessions=require('express-session');
const request = require('request');
const app=express();
const externalService=require('./service/externalService');
const promise=require('promise');
var btoa = require('btoa');
var session;
var respdata;
//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//set session config
app.use(sessions({
	secret:'sunnydodhiya',
	resave:false,
	saveUninitialized: true
}));
//set static path
app.use(express.static(path.join(__dirname,'public')));

//set your view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.get('/',function(resquest,response){

	response.render("index",{invalid:false});
});


app.get('/test',  function(req,res){
		
		externalService.extServiceGetSid("AC23f1b11bbb99a46436c365cb7bec246e","QUMyM2YxYjExYmJiOTlhNDY0MzZjMzY1Y2I3YmVjMjQ2ZTplZWY5NmI5YWZlM2I5ZWJjYmYwNTFkOGFkZjcxNTk0Mw==","12017780615")
						.then((data)=>res.send(data))
						.catch((error)=>res.send(error));
		
		
});

app.post('/test/add',  function(req,res){
		//username,btoa,phoneNumber,friendlyName
		var data=req.body;
		console.log("this is the temp data===>",data,data.phoneNumber);
		externalService.extServiceAddMapping("AC23f1b11bbb99a46436c365cb7bec246e","QUMyM2YxYjExYmJiOTlhNDY0MzZjMzY1Y2I3YmVjMjQ2ZTplZWY5NmI5YWZlM2I5ZWJjYmYwNTFkOGFkZjcxNTk0Mw==",data.phoneNumber,data.friendlyName)
						.then((data)=>res.send(data))
						.catch((error)=>res.send(error));
			


		console.log("==========================================================================================================================================\n");
		
		
});



app.get('/fail',function(req,res){
	res.render("index",{invalid:true});
})

//make user loggin
app.get('/dashboard',function(req,res){
	
	var temp={};
	console.log(typeof session);
	if( typeof session !='undefined' && session.active){
		console.log("get all data")
		getAllData(res);
		
	}else{
		res.render("index",{invalid:false});
	}

	
})

//call for login
app.post('/login',function(req,res){
	//console.log(req);
	var username=req.body.username;
	var password=req.body.password;


	if(username.length ==0 || password.length==0){
		res.redirect('/fail');
	}else{
		console.log(btoa(username+":"+password),username,password);
		//res.send(btoa(username+":"+password));
		session=req.session;
		checkUser(username,password,res);
	}	
});

//get all mapping
app.get('/api/allmapping',function(req,response){

	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings';
	request.get({
		url:url,
		method:'GET',
		headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +session.btoa
		}
	}, (error,res)=>{
		if(error){
			response.send("Server down");
			console.log(error);
		}else{
			if(res.body && res.body=="Unauthorized"){
				response.redirect('/fail');
			}else{
				respdata=[];
				var body=JSON.parse(res.body);
				
				processAllMapping(body).then((mappingData)=>{response.json({mapping:mappingData})}).catch((error)=>{});	
			}
			
		}
	});


})

//start of temp get all mapping 
app.get('/api/all',function(req,response){

	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings';
	request.get({
		url:url,
		method:'GET',
		headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +"QUMyM2YxYjExYmJiOTlhNDY0MzZjMzY1Y2I3YmVjMjQ2ZTplZWY5NmI5YWZlM2I5ZWJjYmYwNTFkOGFkZjcxNTk0Mw=="
		}
	}, (error,res)=>{
		if(error){
			response.send("Server down");
			console.log(error);
		}else{
			if(res.body && res.body=="Unauthorized"){
				response.redirect('/fail');
			}else{
				//respdata=[];
				var body=JSON.parse(res.body);
				
				processAllMapping(body).then((mappingData)=>{response.json({mapping:mappingData})}).catch((error)=>{})
			
					
			}
			
		}
	});


})
//end of temp get all mapping

function processAllMapping(bodyData){

	return new Promise((resolve,reject)=>{
		var responseData=[];
		var nos=1;
		let executeAllPromise=[];
		for(var number in bodyData ){
			console.log("I am in the processAllMapping");
			var data=bodyData[number];
			executeAllPromise.push(externalService.extServiceGetSid(session.username,session.btoa,data.externalAddress));
					
		}

		Promise.all(executeAllPromise)
			   .then((results)=>{
			   	//	console.log("results-->",results);
			   		for(var number in bodyData){
			   			let nos=parseInt(number) +1;
			   			let data=bodyData[number];
			   			let dataFromExternalCall=results[number];
			   			let temp={
				   			no:nos,
							id:data.id,
							jabberAddress:data.jabberAddress,
							externalAddress:data.externalAddress,
							friendlyname:data.domain,
							sid:(typeof dataFromExternalCall !='undefined' &&  dataFromExternalCall.length > 0 && typeof dataFromExternalCall[0].sid != 'undefined')? dataFromExternalCall[0].sid:""				
			   			}
			   			responseData.push(temp);
			   		}
			   		resolve(responseData);
			   })
			   .catch((error)=>{
			   		console.log("error while processing the mapping ",error);
			   		reslove(responseData);
			   });

	});
}

function getAllData(response){
	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings';
	request.get({
		url:url,
		method:'GET',
		headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +session.btoa
		}
	}, (error,res)=>{
		if(error){
			response.send("Server down");
			console.log(error);
		}else{
			if(res.body && res.body=="Unauthorized"){
				response.redirect('/fail');
			}else{
				respdata=[];
				var body=JSON.parse(res.body);
				
				processAllMapping(body).then((mappingData)=>{response.render('dashboard',{mapping:mappingData})}).catch((error)=>{});
				//processAllMapping(body).then((mappingData)=>{response.render({mapping:mappingData})}).catch((error)=>{response.json({mapping:error})});

			}
			
		}
	});	
}


function checkUser(username,password,response){
	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings';
	request.get({
		url:url,
		method:'GET',
		headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +btoa(username+":"+password)
		}
	}, (error,res)=>{
		if(error){
			response.send("Server down");
			console.log(error);
		}else{
			if(res.body && res.body=="Unauthorized"){
				response.redirect('/fail');
			}else{
				
				respdata=[];
				var body=JSON.parse(res.body);
				for(var number in body ){
					var data=body[number]
					var nos=(parseInt(number)+1);
					console.log(nos,number, typeof number);
					var temp={
						no:nos,
						id:data.id,
						jabberAddress:data.jabberAddress,
						externalAddress:data.externalAddress,
						friendlyname:data.domain
					}
					respdata.push(temp);
				}
				session.username=username;
				session.active=true;
				session.user=btoa(username+":"+password);
				session.btoa=btoa(username+":"+password);
				console.log("user name and password is Authorize and redirecting to /dashboard");
				response.redirect('/dashboard');	
			}
			
		}
	});	
}




//create mapping
app.post('/mapping/add',(req,response)=>{
	console.log("I am in mapping");
	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings';
	var friendlyname=req.body.friendlyname;
	var phoneNumber=req.body.externalAddress;
	var data={
			  "jabberAddress": ""+req.body.jabberAddress,
			  "domain":""+req.body.friendlyname,
			  "externalAddress":""+req.body.externalAddress
			}

	if(!checkSession(req)){
		response.redirect('/fail');
	}else{
		console.log(data,url);
		request.post({
			url:url,
			body:data,
			headers:{
			'Content-Type':'application/json',
			"Authorization": "Basic " +session.btoa
			},
			method:"POST",
			json:true

		},(error,res)=>{
			if(error){
				console.log("server down with error-->",error);
				response.json({error:res.body})
			}else{
				var temp=res.body;
				//console.log(res.body);
				if(res.statusCode == 200){
					console.log("my data");
					externalService.extServiceAddMapping(session.username,session.btoa,phoneNumber,friendlyname).then((isSuccess)=>{
						if(isSuccess){
							response.json(temp);
						}else{
							response.json({error:"fail"})
						}
					}).catch((err)=>{
						console.log("error in catch",err);
						response.json({error:""+err})
					});
						

				}else{
					console.log("error in call");
					response.json({error:res.body});
				}
				
			}
		});

	}

});


//delete mapping
app.post('/mapping/delete',(req,response)=>{
	console.log("I am in mapping");
	var data=req.body;
	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings/'+data.id;
	
	if(!checkSession(req)){
		response.redirect('/fail');
	}else{
		console.log(url)
		request.delete({
			url:url,
			headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +session.btoa
			},
			method:"DELETE"

		},(error,res)=>{
			if(error){
				res.send("server down");
				console.log(error);
			}else{
				var temp=res.body;
				//add krna hai
				console.log(temp);
				//PN77e54ce1d5347058f553cebcd839b42
				
				if(res.statusCode == 200){
					externalService.extServiceDeleteMapping(session.username,session.btoa,data.sid).then((isSuccess)=>{
						if(isSuccess){
							response.json(temp);
						}else{
							response.json({error:"fail"})
						}
					}).catch((err)=>{
						response.json({error:err})
					});
						

				}
			}
		});

	}

});


//edit mapping
app.post('/mapping/edit',(req,response)=>{

	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings/'+req.body.id;
	
	var data={
			  "jabberAddress": req.body.jabberAddress,
			  "domain": req.body.friendlyname,
			  "externalAddress": req.body.externalAddress
			}

	if(!checkSession(req)){
		response.redirect('/fail');
	}else{

		request.put({
			url:url,
			body:data,
			headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +session.btoa
			},
			method:"put",
			json:true

		},(error,res)=>{
			if(error){
				response.send("server down");
				console.log(error);
			}else{
				var temp=res.body;
				console.log(res.body);
				if(res.statusCode == 200){
					response.json(temp);	
				}else{
					response.json({error:res.body})
				}
				
			}
		});

	}

});


function checkSession(request){
	if(typeof session !='undefined' && session.active){
		return true;
	}else{
		return false;
	}
}


app.post('/*',function(req,res){
	res.redirect('/');
})

app.get('/*',function(req,res){
	res.redirect('/');
})

app.listen(3000,function(){
	console.log("server started at 3000");
})


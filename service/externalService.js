
const externalServiceRequest = require('request');
module.exports={

	//create mapping for sid
	extServiceAddMapping:function (username,btoa,phoneNumber,friendlyName){
		
		var endPointUrl="https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/"+username+"/IncomingPhoneNumbers.json";
		var data={
			"PhoneNumber":phoneNumber,
			"SmsUrl":"https://cloud-xmpp-service.restcomm.com/xmpp/messages/sms",
			"isSIP":"true",
			"FriendlyName":friendlyName
		};
		console.log("in external service addMapping -->",endPointUrl,data);
		return new Promise((resolve,reject)=>{
			externalServiceRequest.post({
				url:endPointUrl,
				body:data,
				headers:{
					'Content-Type': 'application/json',
	      			"Authorization": "Basic " +btoa
		      	},
		      	method:"POST",
		      	json:true

				},(exterror,extres)=>{
					console.log("entered the external create service call");
					if(exterror){
						console.log("ext call while adding mapping failed with error ",exterror);

						resolve(false);
					}else{
						
						if(extres.statusCode==200){
							console.log("call successfull");
							resolve(true);
						}else{
							console.log("ext call failed ",extres.statusCode,extres.headers,extres.rawHeaders);
							console.log(username,btoa,phoneNumber,friendlyName);
							reject(`call failed with error ${extres.statusCode}`) ;
						}
					}
				});


			});
		
	},

	//get sid for mapping
	extServiceGetSid:function(username,btoa,phoneNumber){
		var endPointUrl="https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/"+username+"/IncomingPhoneNumbers.json?PhoneNumber="+phoneNumber;
		console.log("phone number -->",phoneNumber);
		//console.log("Inside extServiceGetSid-->",username,btoa,phoneNumber,endPointUrl);
		var data={
			"PhoneNumber":phoneNumber
		};

		return new Promise((resolve,reject)=>{
		//console.log("in the promise");
		externalServiceRequest.get({
			url:endPointUrl,
			headers:{
				'Content-Type': 'application/json',
      			"Authorization": "Basic " +btoa
	      	},
	      	method:"GET",
	      	json:true

			},(exterror,extres)=>{
				if(exterror){
				//	console.log("ext call while getting sid with ",exterror);
					reject(exterror);
				}else{
				//	console.log("my data",extres.body.incomingPhoneNumbers);			
					//return extres.body.incomingPhoneNumbers;
					console.log((extres.statusCode == 200));
					resolve(extres.body.incomingPhoneNumbers);
				}
			});



		});
	},

	//delete sid for mapping 
	extServiceDeleteMapping:function(username,btoa,sid){
		var endPointUrl="https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/"+username+"/IncomingPhoneNumbers/"+sid;
		var data={
		};
		new Promise((resolve,reject)=>{
			externalServiceRequest.delete({
				url:endPointUrl,
				body:data,
				headers:{
					'Content-Type': 'application/json',
					"Authorization": "Basic " +btoa
		      	},
		      	json:true

				},(exterror,extres)=>{
					if(exterror){
						console.log("ext call while adding mapping failed with error ",exterror);
						reject(exterror);
					}else{
						
						if(extres.statusCode==200){
							console.log("call successfull");
							resolve(true);
						}else{
							console.log("ext call failed ",extres);
							resolve(false) ;
						}
					}
				});
		});
	}

}



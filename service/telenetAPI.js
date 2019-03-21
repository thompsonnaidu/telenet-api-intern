
const telenetAPIRequest = require('request');
const PropertiesReader=require('properties-reader');
const properties=PropertiesReader('./dev.prop');
module.exports={

	//add Number to telenet API
	addNumberToTelenet:function (phoneNumber){
		
		var endPointUrl=`https://apiv1.teleapi.net/dids/offnet/submit?token=xxxx-dummy-token&numbers=${phoneNumber}`;
	
		console.log("in Telenet  service addNumberToTelenet -->",endPointUrl);
		return new Promise((resolve,reject)=>{
			telenetAPIRequest.get({
				url:endPointUrl,
				body:{},
				
		      	method:"get",
		      	json:true

				},(exterror,extres)=>{

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

	//delete Number from telenet API
	deleteNumberFromTelenet:function(phoneNumber){
		var endPointUrl=`https://apiv1.teleapi.net/user/dids/remove?token=${properties.get('token')}&did_number=${phoneNumber}`;

		console.log("phone number -->",phoneNumber);
		//console.log("Inside extServiceGetSid-->",username,btoa,phoneNumber,endPointUrl);
		return new Promise((resolve,reject)=>{
		//console.log("in the promise");
		telenetAPIRequest.get({
			url:endPointUrl,
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

	

}

	var id='',sid;
	var table;
	var rownumber,jaddress,eaddress,friendlyname;
	function deleteData(id,sid){
		this.id=id;
		this.sid=sid;
	}

	function editData(ids,row,jabberAddress,externalAddress,friendlyname,sid){
		console.log("edit data");
		this.id=ids;
		this.rownumber=row;
		this.jaddress=jabberAddress;
		this.eaddress= externalAddress;
		this.friendlyname= friendlyname;
		this.sid=sid;
	}
	
	//get all mapping
	function getallMapping(){

		$.ajax({
			url:"/api/allmapping",
			type:"get",
			success(result){
				console.log("i ma in",result.mapping);
				console.log(result);
				console.log(result.length);
				if(typeof result != 'undefined' && result.mapping.length>0){
					var htmldata='';
					for(var i in result.mapping){
						
						var fname=(typeof result.mapping[i].friendlyname == "undefined")?'':result.mapping[i].friendlyname;
						htmldata=htmldata+`

    								<tr>
							            <td>`+(parseInt(i)+1)+`</td>
							            <td>`+result.mapping[i].id+`</td>
							            <td>`+result.mapping[i].jabberAddress+`</td>
										<td>`+result.mapping[i].externalAddress+`</td>
										<td>`+fname+`</td>
							            <td>
							          
											<span class="btn btn-sm btn-warning" data-toggle="modal" data-target="#editModal" onclick="editData('`+result.mapping[i].id+`',`+result.mapping[i].no+`,'`+result.mapping[i].jabberAddress+`','`+result.mapping[i].externalAddress+`','${fname}','${result.mapping[i].sid}')">
											Edit
										</span>
							            	<span class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteModal" onclick="deleteData('`+result.mapping[i].id+`','${result.mapping[i].sid}')">
							            		Delete
							            	</span>
							            </td>
							        </tr>
    					`;
					}

					$('#mappingTable > tbody ').empty().html(htmldata);	
				} 
			}
		})
	}

$(document).ready( function () {
   table= $('#mappingTable').DataTable({
   		ajax: {
   			select:true,
	        url: '/api/allmapping',
	        dataSrc: function(json){

	        		for(let index in json.mapping){
	        				json.mapping[index].DT_RowId=json.mapping[index].id;
	        		}
	        		console.log(json);
	        		return json.mapping;
	        },  
    	},
    	columns:[{data:"no"},{data:"id"},{data:"jabberAddress"},{data:"externalAddress"},{data:"friendlyname",defaultContent:""},{data:"sid",render:(data,type,row)=>{
			if(!row.hasOwnProperty("friendlyname")){
    			row["friendlyname"]="";
			}
    		return `<span class="btn btn-sm btn-warning" data-toggle="modal" data-target="#editModal" onclick="editData('`+row["id"]+`',`+row["no"]+`,'${row["jabberAddress"]}','${row["externalAddress"]}','${row["friendlyname"]}','${data}')">
							            		Edit
							            	</span>
							            	<span class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteModal" onclick="deleteData('`+row["id"]+`','${data}')">
							            		Delete
							            	</span>`
    	}}]
   });
   $("#createMappingError").hide();
   $("#editMappingError").hide();


   //onclick create mapping
    $('#addMapping').on('click',function(){
    	console.log("i am in click");
    	var address=$("#newjabberAddress").val();
		var number=$('#newrcnumber').val();
		var friendlyname = $('#friendlyname').val();
		console.log("checkingg...")
    	console.log(address,number,friendlyname);
    	$.ajax({
    		url:'/mapping/add',
    		data:{jabberAddress:address,externalAddress:number,friendlyname:friendlyname},
    		type:"post",
    		success(result){
    			//console.log(result)
    			var totalrow=$("#mappingTable tr").length+1;
    			if(typeof result.error == 'undefined'){
    				table.ajax.reload();
					$('#createModal').modal('hide');
					$("#newjabberAddress").val("");
					$("#newrcnumber").val("");
					$("#friendlyname").val("");
					
					$("#createMappingError").hide();
				
				}else{
					
					$("#createMappingError").show();
				}    			
    		}
		});
		
    });
    

//editmapping control
    $('#editMapping').on('click',function(){
    	console.log("i am in click");
    	var address=$("#editjabberAddress").val();
		var number=$('#editrcnumber').val();
		var friendlyName=$('#editfriendlyname').val();
    	console.log("this-->",address,number,friendlyName);
    	$.ajax({
    		url:'/mapping/edit',
    		data:{id:id,jabberAddress:address,externalAddress:number,friendlyname:friendlyName},
    		type:"post",
    		success(result){
    			if(typeof result.error == 'undefined'){
					//console.log(typeof result.error != undefined);
					let tempdata=table.row($('#'+id)).data();
					let domainName=(result.hasOwnProperty("domain"))?result.domain:"";
					//table.row($('#'+id)).remove();	
					let finalData={
							"DT_RowId":result.id,
							"no":tempdata.no,
							"id":result.id,
							"jabberAddress":result.jabberAddress,
							"externalAddress":result.externalAddress,
							"friendlyname":(result.hasOwnProperty("domain"))?result.domain:"",
							"sid":tempdata.sid
					}
					table.row($('#'+id)).data(finalData).draw();
				$("#editjabberAddress").val("");
				$("#editrcnumber").val("");
				$("#editfriendlyname").val("");
				$("#editMappingError").hide();

    			$('#editModal').modal('hide');
				}else{
					
					$("#editMappingError").show();
				}    	
				//location.reload();		
    		}
    	});


    });

    $('#deleteMapping').on('click',function(){

    //	console.log("i am in click");
    	$.ajax({
			url:"./mapping/delete",
			type:"post",
			data:{id:id,sid:sid},
			success(result){
				console.log(result);
				table.ajax.reload();
				$('#deleteModal').modal('hide');
				
			}
			
		});
		
    	
    });


    //resetting the fields
    $('#createModal').on('hidden.bs.modal',function(e){
    	console.log("in hidden modal");
    	$("#newjabberAddress").val("");
		$("#newrcnumber").val("");
		$("#friendlyname").val("");
		$("#createMappingError").hide();
	//	location.reload();
		table.ajax.reload();
    });

    $('#editModal').on('hidden.bs.modal',function(e){
    	
    	$("#editjabberAddress").val("");
		$("#editrcnumber").val("");
		$("#editfriendlyname").val("");
		$("#editMappingError").hide();
	});
	
    $('#editModal').on('show.bs.modal',function(e){
    	console.log("i",table.row($('#'+id)).data(),id);

    	$("#editjabberAddress").val(jaddress);
		$("#editrcnumber").val(eaddress);
		$("#editfriendlyname").val(friendlyname);
		$("#editMappingError").hide();
    });


} );


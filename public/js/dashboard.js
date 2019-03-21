	var id='',sid;
	var rownumber,jaddress,eaddress,friendlyname;
	function deleteData(id,sid){
		this.id=id;
		this.sid=sid;
	}

	function editData(ids,row,jabberAddress,externalAddress,friendlyname,sid){
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
				
				console.log(result.length);
				if(typeof result != 'undefined' && result.mapping.length>0){
					var htmldata='';
					for(var i in result.mapping){
						htmldata=htmldata+`

    								<tr>
							            <td>`+(parseInt(i)+1)+`</td>
							            <td>`+result.mapping[i].id+`</td>
							            <td>`+result.mapping[i].jabberAddress+`</td>
										<td>`+result.mapping[i].externalAddress+`</td>
										<td>`+result.mapping[i].friendlyname+`</td>
							            <td>
							          
											<span class="btn btn-sm btn-warning" data-toggle="modal" data-target="#editModal" onclick="editData('`+result.mapping[i].id+`',`+result.mapping[i].no+`,'`+result.mapping[i].jabberAddress+`','`+result.mapping[i].externalAddress+`')">
											Edit
										</span>
							            	<span class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteModal" onclick="deleteData('`+result.mapping[i].id+`')">
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
   var  table= $('#mappingTable').DataTable();
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
    			getallMapping();
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

					$('#'+id).empty().html(`

							            <td>`+rownumber+`</td>
							            <td>`+result.id+`</td>
							            <td>`+result.jabberAddress+`</td>
										<td>`+result.externalAddress+`</td>
										<td>`+result.friendlyname+`</td>
							            <td>
							            	<span class="btn btn-sm btn-warning" data-toggle="modal" data-target="#editModal onclick="editData('`+result.id+`',`+rownumber+`)">
							            		Edit
							            	</span>
							            	<span class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteModal" onclick="deleteData('`+result.id+`')">
							            		Delete
							            	</span>
							            </td>
    				`);

				
				$("#editjabberAddress").val("");
				$("#editrcnumber").val("");
				$("#editfriendlyname").val("");
				$("#editMappingError").hide();

    			$('#editModal').modal('hide');
				}else{
					
					$("#editMappingError").show();
				}    	
				location.reload();		
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
				
				getallMapping();
				$('#deleteModal').modal('hide');
				location.reload();
			}
			
		});
		//location.reload();
    	
    	
    });


    //resetting the fields
    $('#createModal').on('hidden.bs.modal',function(e){
    	console.log("in hidden modal");
    	$("#newjabberAddress").val("");
		$("#newrcnumber").val("");
		$("#friendlyname").val("");
		$("#createMappingError").hide();
	//	location.reload();
		
    });

    $('#editModal').on('hidden.bs.modal',function(e){
    	
    	$("#editjabberAddress").val("");
		$("#editrcnumber").val("");
		$("#editfriendlyname").val("");
		$("#editMappingError").hide();
	});
	
    $('#editModal').on('show.bs.modal',function(e){
    	
    	$("#editjabberAddress").val(jaddress);
		$("#editrcnumber").val(eaddress);
		$("#editfriendlyname").val(friendlyname);
		$("#editMappingError").hide();
    });
} );


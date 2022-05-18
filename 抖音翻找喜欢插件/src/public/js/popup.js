$(function(){
	chrome.storage.sync.get(["run"], function (result) {
		if(result['run']){
			$("#statusButton").val("停用");
		}else{
			$("#statusButton").val("启用");
		}
	})
	//停用与启用
	$("#statusButton").on("click", function(){
		chrome.storage.sync.get(["run"], function (result) {
			if(result['run']){
				chrome.storage.sync.set({"run": false});
				$("#statusButton").val("启用");
			}else{
				chrome.storage.sync.set({"run": true});
				$("#statusButton").val("停用");
			}
		})
	});
});


// function sendMessageScrapResult(){
// 	chrome.tabs.query({
// 			url:"http://www.lionair.co.id/Default.aspx"
// 		},function(tabs){
// 		console.log(tabs);
// 		if(tabs.length){
// 			lastTabId = tabs[0].id;
// 			chrome.tabs.sendMessage(lastTabId, "scrap_result");
// 		}
// 	});
// }

// sendMessageScrapResult();

if(jQuery){
	console.log("jQuery loaded");
}
else{
	console.log("jQuery not loaded");
}

function formatDate(date){
	return $.format.date(date,"ddMMM");
}

function incrementDate(date){
	return new Date(date.getFullYear(),date.getMonth(),date.getDate()+1);
}

chrome.browserAction.setBadgeText({text: "ON"});
console.log("Loaded.");

var lastDate=new Date();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("receive request : ");
	console.log(request);
	if (request.method == "getPageToBook"){
		var param={
			trip_type:"one way",
			date_flexibility:"fixed",
			depart:"CGK",
			"dest.1":"DPS",
			"date.0":"22SEP",
			"date.1":"22SEP",
			"persons.0":1,
			"persons.1":0,
			"persons.2":0,
			origin:"EN",
			usercountry:"ID"
		};
		param["date.1"]=param["date.0"]=formatDate(lastDate);
		lastDate=incrementDate(lastDate);
		console.log("send response : ");
		console.log(param);
		sendResponse(param);
	}
	else{
		sendResponse({}); // snub them.
	}
});


function sendMessageScrapResult(){
	chrome.tabs.query({
			url:"http://www.lionair.co.id/Default.aspx"
		},function(tabs){
		console.log(tabs);
		if(tabs.length){
			lastTabId = tabs[0].id;
			chrome.tabs.sendMessage(lastTabId, "scrap_result");
		}
	});
}

sendMessageScrapResult();
chrome.browserAction.setBadgeText({text: "ON"});
console.log("Loaded.");
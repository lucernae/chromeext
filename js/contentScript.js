
var domain="https://secure2.lionair.co.id/lionairibe/OnlineBooking.aspx";
var server="http://localhost/";

function generateUrl(trip_type,date_flexibility,depart,dest,arrivedDate,returnDate,adult,child,infant){
	var param={
		trip_type:trip_type,
		date_flexibility:date_flexibility,
		depart:depart,
		"dest.1":dest,
		"date.0":arrivedDate,
		"date.1":returnDate,
		"persons.0":adult,
		"persons.1":child,
		"persons.2":infant,
		origin:"EN",
		usercountry:"ID"
	};
	return domain +"?"+$.param(param);
}

function isInBookingPage(){
	if($("#imgStepHeader")!=null && $("#imgStepHeader").attr('src') !=null && $("#imgStepHeader").attr('src').indexOf("banner_step1.jpg")!=-1){
	// if(window.location.href.indexOf("www.lionair.co.id")!=-1){
		return true;
	}
	else{
		return false;
	}
}

function isInSchedulePage(){
	if($("#imgStepHeader")!=null && $("#imgStepHeader").attr('src') !=null && $("#imgStepHeader").attr('src').indexOf("banner_step2.jpg")!=-1){
		return true;
	}
	else{
		return false;
	}
}

function resetBooking(){
	console.log("resetting...");
	window.location.href="javascript:__doPostBack('lbGoBack','');";
}

console.log("Content Script run ");

$(document).ready(function(){
	if(isInBookingPage()){
		chrome.runtime.sendMessage({method:"getPageToBook"},function(response){
			console.log("Check booking");
			console.log(response);
			if(response!={}){
				var url=domain+"?"+$.param(response);
				window.location=url;	
			}
		});
	}
	else if(isInSchedulePage()){
		// scrap data
		var routes=[];
		$(".flighttable_Row").each(function(idx){
			var flightNumber=$(".FlightNumberInTable:eq(0)",this).text();
			var airplaneType=$(".FlightNumberInTable:eq(1)",this).text();
			var carrier=$(".FlightNumberInTable:eq(2)",this).text();
			var details=$("td:eq(1)",this).text();
			var _depart=$("td:eq(2) b",this).text();
			var _departTime=$("td:eq(2) br",this)[0].nextSibling.nodeValue;
			var depart=_depart.match(/\s\((\w+)\)$/)[1];
			var departTime=_departTime.match(/(\d\d:\d\d)$/)[1];
			var _arr=$("td:eq(3) b",this).text();
			var _arrTime=$("td:eq(3) br",this)[0].nextSibling.nodeValue;
			var arr=_arr.match(/\s\((\w+)\)$/)[1];
			var arrTime=_arrTime.match(/(\d\d:\d\d)$/)[1];
			var promo;
			try{
				promo=$("td:eq(4) label br",this)[0].nextSibling.nodeValue;	
			}
			catch(err){

			}
			var economy;
			try{
				economy=$("td:eq(5) label br",this)[0].nextSibling.nodeValue;
			}
			catch(err){

			}
			var bussiness;
			try{
				bussiness=$("td:eq(5) label br",this)[0].nextSibling.nodeValue;	
			}
			catch(err){

			}

			var route={
				flightNumber:flightNumber,
				airplaneType:airplaneType,
				carrier:carrier,
				details:details,
				depart:depart,
				departTime:departTime,
				arr:arr,
				arrTime:arrTime,
				promo:promo,
				economy:economy,
				bussiness:bussiness
			};
			routes.push(route);
		});
		$.ajax({
			type:'POST',
			url:server,
			data:{routes:routes},
			succes:function(data){
				console.log('Success');
			},
			dataType:'json',
			async:false
		});
		console.log(routes);
		// reset booking
		console.log("resetBooking");
		setTimeout(resetBooking,5000);
	}
});
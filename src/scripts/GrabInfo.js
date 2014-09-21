// Listen for message to start gathering the info
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "grabInfo") {
		sendResponse({response: "grabInfoOK"});
		grabInfo();
		//console.log("Grabbing Info");
	}
});

var infoarray		= new Array();

// Function for grabbing manga information
function grabInfo(pend) {

	var currenturl = "http://www.dotabuff.com/player" + localStorage["player_id"];

	$.ajax({     
		type: "GET",		
		url: currenturl,
		dataType: "HTML",
		async: false,
		success: function(data) {

			var manganame 	= data.content.content_name;
			var series		= data.content.content_series;				//Array
			var authorname 	= data.content.content_artists;				//Array
			var translator 	= data.content.content_translators;			//Array
			var language 	= data.content.content_language;
			var quant 		= data.content.content_pages;
			var description = data.content.content_description;
			var	tags	 	= data.content.content_tags;				//Array
			var imgCover 	= data.content.content_images.cover;
			var imgSample	= data.content.content_images.sample;
			var date 		= data.content.content_date;

			// console.log("pages: " + quant);
			// console.log("name: " + manganame);
			// console.log("series: " + series);
			// console.log("author: " + authorname);
			// console.log("language: " + language);
			// console.log("translator: " + translator);
			// console.log("tags: " + tags);
			// console.log("description: " + description);
			// console.log("cover: " + imgCover);
			// console.log("sample: " + imgSample);
			
			infoarray[0] 	= "infoarray";
			infoarray[1] 	= quant;
			infoarray[2] 	= manganame;
			infoarray[3] 	= series;
			infoarray[4] 	= authorname;
			infoarray[5] 	= language;
			infoarray[6] 	= translator;
			infoarray[7] 	= tags;
			infoarray[8] 	= description;
			infoarray[9] 	= imgCover;
			infoarray[10] 	= imgSample;
			infoarray[11]	= date;

						
		},
		error: function(error) {
			infoarray[0] = "infoarray"
			infoarray[1] = "error";
			infoarray[2] = error.status;
			infoarray[3] = error.statusText;
			notificationInfo(infoarray, pend);
		}
	});
};

// Sends a message stating that the information has been grabbed properly.
function msgDocReadyInfo(ndownload) {
	chrome.runtime.sendMessage({msg: "docReadyInfo", data: infoarray});
		nDocReadyInfo(infoarray);
}
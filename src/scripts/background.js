// Listen for a message to trigger the grabInfo function
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "GrabInfo") {
		grabInfo();
		sendResponse({msg: "done"});
	}
});

// Function for grabbing manga information
function grabInfo(pend) {

	var currenturl = "http://www.dotabuff.com/players/" + localStorage["player_id"];

	$.ajax({     
		type: "GET",		
		url: currenturl,
		dataType: "HTML",
		async: false,
		success: function(html) {

			var data_stats			= new Array();
			var data_mostPlayed 	= new Array();
			var data_latestMatches 	= new Array();
			var data_lifetimeStats 	= new Array();
			var data_friends		= new Array();

			var stats 				= $(html).find('div#content-header-secondary dl');
			var mostPlayed 			= $(html).find('div.primary section:nth-of-type(1) article table tbody tr');
			var latestMatches 		= $(html).find('div.primary section:nth-of-type(2) article table tbody tr');
			var lifetimeStats 		= $(html).find('div.secondary section:nth-of-type(1) article table tbody');
			var friends				= $(html).find('div.secondary section:nth-of-type(2) article table tbody tr');
			//console.log(latestMatches);

		  // In stats find
				data_stats = [{ 
					lastmatch: 		stats[0].childNodes[1].innerHTML, 
					win: 			stats[1].childNodes[1].childNodes[0].childNodes[0].textContent,
					loss: 			stats[1].childNodes[1].childNodes[0].childNodes[2].textContent,
					abandon: 		stats[1].childNodes[1].childNodes[0].childNodes[4].textContent,
					winrate: 		stats[2].childNodes[1].textContent
				}]
				//console.log(data_stats);

		  // For each matched in mostPlayed
			$.each(mostPlayed, function(i, tr) {
				data_mostPlayed[i] = [{ 
					hero: 			tr.childNodes[1].childNodes[0].innerText, 
					matches: 		tr.childNodes[2].childNodes[0].textContent,
					winrate: 		tr.childNodes[3].childNodes[0].textContent,
					kda: 			tr.childNodes[4].childNodes[0].textContent,

					bar_matches: 	tr.childNodes[2].childNodes[1].innerHTML,
					bar_winrate: 	tr.childNodes[3].childNodes[1].innerHTML,
					bar_kda: 		tr.childNodes[4].childNodes[1].innerHTML
				}]
				//console.log(data_mostPlayed);
			})

		  // For each matched in latestMatches
			$.each(latestMatches, function(i, tr) {
				data_latestMatches[i] = [{ 
					hero: 			tr.childNodes[1].childNodes[0].innerText,
					result: 		tr.childNodes[2].childNodes[0].innerText,
					link_result:	tr.childNodes[2].childNodes[0].pathname,
					type: 			tr.childNodes[3].childNodes[0].textContent,
					duration: 		tr.childNodes[4].childNodes[0].textContent,
					kda: 			tr.childNodes[5].childNodes[0].innerText,

					bracket: 		tr.childNodes[1].childNodes[1].innerText,
					time: 			tr.childNodes[2].childNodes[1].innerHTML,
					mode: 			tr.childNodes[3].childNodes[1].innerText,
					bar_duration: 	tr.childNodes[4].childNodes[1].innerHTML,
					bar_kda: 		tr.childNodes[5].childNodes[1].innerHTML
				}]
				//console.log(data_latestMatches);
			})

		  // For each matched in lifetimeStats
			$.each(lifetimeStats, function(i, tbody) {
				var category;
				var category_array = new Array();
				var count = i;

				switch (i) {
					case 0:
						category = "Lifetime";
						break;
					case 1:
						category = "Lobby Type";
						break;
					case 2:
						category = "Game Mode";
						break;
					case 3:
						category = "Faction";
						break;
					case 4:
						category = "Region";
						break;
				}
				$.each(tbody.childNodes, function(i, tr) {

					category_array[i] = [{ 
						category: 		category,
						stat: 			tr.childNodes[0].innerText,
						matches: 		tr.childNodes[1].innerText,
						winrate: 		tr.childNodes[2].innerText,

						bar_matches: 	tr.childNodes[1].childNodes[1].innerHTML,
						bar_winrate: 	tr.childNodes[2].childNodes[1].innerHTML
					}]
					//console.log(category_array);
				})
				data_lifetimeStats[i] = category_array;
				//console.log(data_lifetimeStats);
			})

		  // For each matched in friends
			$.each(friends, function(i, tr) {
				data_friends[i] = [{ 
					image: 			tr.childNodes[0].childNodes[0].childNodes[0].childNodes[0].src,
					friend: 		tr.childNodes[1].innerHTML,
					matches: 		tr.childNodes[2].innerText,
					winrate: 		tr.childNodes[3].innerText,

					bar_matches: 	tr.childNodes[2].childNodes[1].innerHTML,
					bar_winrate: 	tr.childNodes[3].childNodes[1].innerHTML
				}]
				//console.log(data_friends);
			})

			sendInfo(data_stats, data_mostPlayed, data_latestMatches, data_lifetimeStats, data_friends);
						
		},
		error: function(error) {
			var error_array = new Array();
			error_array[0] = "error";
			error_array[1] = error.status;
			error_array[2] = error.statusText;
			sendInfo(error_array);
		}
	});
};

function sendInfo(data_stats, data_mostPlayed, data_latestMatches, data_lifetimeStats, data_friends) {
	if (data_mostPlayed[0] == "error") {
		var error_array = data_mostPlayed;
		chrome.runtime.sendMessage({msg: "error", errorData: error_array, from: "background"});
	} else {
		chrome.runtime.sendMessage({msg: "none", stats: data_stats, mostPlayed: data_mostPlayed, latestMatches: data_latestMatches, lifetimeStats: data_lifetimeStats, friends: data_friends,  from: "background"});
	}

}
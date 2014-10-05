
	var errorReport		= false;
	var errorMsg 		= null;
	var idCounter		= 0;
	var idCounterTemp	= 0;

	var rMapped = /\s|\'/gi;
	var eMapped = {
		" ":"-",
		"'":"" 
	};

fetchData(); // Run fetchData function

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "none") {
		data_stats 			= request.stats,
		data_mostPlayed 	= request.mostPlayed;
		data_latestMatches 	= request.latestMatches;
		data_lifetimeStats 	= request.lifetimeStats;
		data_friends 		= request.friends;

		// console.log(data_stats);
		// console.log(data_mostPlayed);
		// console.log(data_latestMatches);
		// console.log(data_lifetimeStats);
		// console.log(data_friends);

		createDivs(data_stats, data_mostPlayed, data_latestMatches, data_lifetimeStats, data_friends);

	} else if (request.msg == "error") {
		$('body').css("opacity", "1");
		$('div#float').hide();
		$('div#float').attr("class", "");

		$('div#float').empty();
	}
});

// Send message to background script to fetch data.
function fetchData() {
	if (localStorage["player_id"] == "" || localStorage["player_id"] == undefined) {
		noPlayerID();
	} else {
		// $('body').css("opacity", "0.6");
		// $('div#float').empty();
		// $('div#float').show();
		// $('div#float').prepend("<div id='loading' class='loadingtrail'></div>");

	chrome.runtime.sendMessage({msg: "GrabInfo", from: "Dropdown"});
	}
}

// Function waiting for the information from GrabInfo
function createDivs(data_stats, data_mostPlayed, data_latestMatches, data_lifetimeStats, data_friends) {
  // Top stats
	$('div#record div.stats-bot span.win').text(data_stats[0].win);
	$('div#record div.stats-bot span.loss').text(data_stats[0].loss);
	$('div#record div.stats-bot span.abandon').text(data_stats[0].abandon);
	$('div#win-rate div.stats-bot').text(data_stats[0].winrate);
	$('div#last-match div.stats-bot').html('<span title="'+ (data_stats[0].time.match(/>.*</))[0].slice(1, -1) +'">'+ calculateTime(data_stats[0]) +'</span>');

// Type menus
  // Type menus for Latest Matches
  	var divs_latestMatches = [
  		'<div class="match-top-row">Hero</div>',
  		'<div class="match-top-row">Result</div>',
  		'<div class="match-top-row">Type</div>',
  		'<div class="match-top-row">Duration</div>',
  		'<div class="match-top-row">KDA</div>'
	];

	$('div#latest-matches').append('<div class="type-row"></div>');
	$('div#latest-matches div.type-row:nth-of-type(1)').append(divs_latestMatches);

  // Type menus for Most Played
  	var divs_mostPlayed = [
  		'<div class="match-top-row">Hero</div>',
  		'<div class="match-top-row">Matches Played</div>',
  		'<div class="match-top-row">Win Rate</div>',
  		'<div class="match-top-row">KDA Ratio</div>',
	];

	$('div#most-played').append('<div class="type-row"></div>');
	$('div#most-played div.type-row:nth-of-type(1)').append(divs_mostPlayed);

  // Type menus for Lifetime Stats
  	var divs_lifetimeStats = new Array();

  	for (var i = 1; i <= 5; i++) {
  		divs_lifetimeStats.push('<div class="type-container"><div class="type-row-lifetime-stats"></div></div>');
  	}

	$('div#lifetime-stats').append(divs_lifetimeStats);

	var divs_matchWinrate = [
		'<div class="match-top-row-lifetime-stats">Matches</div>',
		'<div class="match-top-row-lifetime-stats">Win Rate</div>'
	];

   // Type of Stat
	$('div#lifetime-stats div.type-container:nth-of-type(1) div.type-row-lifetime-stats').append('<div class="match-top-row-lifetime-stats">Gamemode</div>');		// Gamemode
	$('div#lifetime-stats div.type-container:nth-of-type(2) div.type-row-lifetime-stats').append('<div class="match-top-row-lifetime-stats">Faction</div>');		// Faction
	$('div#lifetime-stats div.type-container:nth-of-type(3) div.type-row-lifetime-stats').append('<div class="match-top-row-lifetime-stats">Lobby Type</div>');	// Lobby Type
	$('div#lifetime-stats div.type-container:nth-of-type(4) div.type-row-lifetime-stats').append('<div class="match-top-row-lifetime-stats">Lifetime</div>');		// Lifetime
	$('div#lifetime-stats div.type-container:nth-of-type(5) div.type-row-lifetime-stats').append('<div class="match-top-row-lifetime-stats">Region</div>');		// Region
  // Divs for number of matches and winrate
	for (var i = 1; i <= 5; i++) {
		$('div#lifetime-stats div.type-container:nth-of-type('+ i +') div.type-row-lifetime-stats').append(divs_matchWinrate);
	}

  // Type menus for Friends
	$('div#friends').append('<div class="type-row"></div>');
	$('div#friends div.type-row:nth-of-type(1)').append('<div class="match-top-row-friend">Friend</div>');
	$('div#friends div.type-row:nth-of-type(1)').append('<div class="match-top-row-friend">Matches</div>');
	$('div#friends div.type-row:nth-of-type(1)').append('<div class="match-top-row-friend">Win Rate</div>');

  // Create divs for Latest Matches Tab
	$.each(data_latestMatches, function(i, data) {
		$('div#latest-matches').append('<div class="match-row"></div>');
		var count = 2 + i;

		$.each(data, function(i, data) {
			var matchTitle = (data.time.match(/>.*</))[0].slice(1, -1);
			var div_append = [
				'<div class="match-inline-row"><a class="tab-link" href="http://dotabuff.com/heroes/'+ data.hero.replace(rMapped, function(matched) { return eMapped[matched] }).toLowerCase() +'"><img alt="'+ data.hero +'" class="hero-image" src="http://www.dotabuff.com/assets/heroes/'+ data.hero.replace(rMapped, function(matched) { return eMapped[matched] }).toLowerCase() +'.png"></a></div>',
				'<div class="match-inline-row"><div class="top-row-won-match"><a class="tab-link" href="http://dotabuff.com/heroes/'+ data.hero.replace(rMapped, function(matched) { return eMapped[matched] }).toLowerCase() +'">'+ data.hero +'</a></div><div class="bot-row">'+ data.bracket +'</div>',
				'<div class="match-inline-row"><div class="top-row-'+ data.result.replace(rMapped, function(matched) { return eMapped[matched] }).toLowerCase() +'"><a class="tab-link" href="'+ data.link_result.replace("/matches/", "http://www.dotabuff.com/matches/") +'">'+ data.result +'</a></div><div class="bot-row" title="'+ matchTitle +'">'+ calculateTime(data) +'</div></div>',
				'<div class="match-inline-row"><div class="top-row">'+ data.type +'</div><div class="bot-row">'+ data.mode +'</div></div>',
				'<div class="match-inline-row"><div class="top-row">'+ data.duration +'</div><div class="bot-row bar">'+ data.bar_duration +'</div></div>',
				'<div class="match-inline-row"><div class="top-row">'+ data.kda +'</div><div class="bot-row bar">'+ data.bar_kda +'</div></div>'
			];
			$('div#latest-matches div.match-row:nth-of-type('+ count +')').append(div_append);
		})
	})

  // Create divs for Most Played Tab
	$.each(data_mostPlayed, function(i, data) {
		$('div#most-played').append('<div class="match-row"></div>');
		var count = 2 + i;

		$.each(data, function(i, data) {
			var div_append = [
				'<div class="match-inline-row"><a class="tab-link" href="http://dotabuff.com/heroes/'+ data.hero.replace(rMapped, function(matched) { return eMapped[matched] }).toLowerCase() +'"><img alt="'+ data.hero +'" class="hero-image" src="http://www.dotabuff.com/assets/heroes/'+ data.hero.replace(rMapped, function(matched) { return eMapped[matched] }).toLowerCase() +'.png"></a></div>',
				'<div class="match-inline-row"><div class="top-row-won-match"><a class="tab-link" href="http://dotabuff.com/heroes/'+ data.hero.replace(rMapped, function(matched) { return eMapped[matched] }).toLowerCase() +'">'+ data.hero +'</a></div><div class="bot-row"></div>',
				'<div class="match-inline-row"><div class="top-row">'+ data.matches +'</div><div class="bot-row bar">'+ data.bar_matches +'</div></div>',
				'<div class="match-inline-row"><div class="top-row">'+ data.winrate +'</div><div class="bot-row bar">'+ data.bar_winrate +'</div></div>',
				'<div class="match-inline-row"><div class="top-row">'+ data.kda +'</div><div class="bot-row bar">'+ data.bar_kda +'</div></div>'
			];
			$('div#most-played div.match-row:nth-of-type('+ count +')').append(div_append);
		})
	})

  // Create divs for Lifetime Stats Tab
	$.each(data_lifetimeStats, function(i, data) {
		var count = 1 + i;
		var rowCount = 2;

		$.each(data, function(i, data) {
			$('div#lifetime-stats div.type-container:nth-of-type('+ count +')').append('<div class="match-row"></div>');
			$.each(data, function(i, data) {
				var div_append = [
					'<div class="match-inline-row-lifetime-stats"><div class="top-row">'+ data.stat +'</div><div class="bot-row bar"></div></div>',
					'<div class="match-inline-row-lifetime-stats"><div class="top-row">'+ data.matches +'</div><div class="bot-row bar">'+ data.bar_matches +'</div></div>',
					'<div class="match-inline-row-lifetime-stats"><div class="top-row">'+ data.winrate +'</div><di  class="bot-row bar">'+ data.bar_winrate +'</div></div>'
				];
				$('div#lifetime-stats div.type-container:nth-of-type('+ count +') div.match-row:nth-of-type('+ rowCount +')').append(div_append);
				rowCount++;
			})
		})
	})

  // Create divs for Friends Tab
	$.each(data_friends, function(i, data) {
		$('div#friends').append('<div class="match-row-friend"></div>');
		var count = 2 + i;

		$.each(data, function(i, data) {
			var div_append = [
				'<div class="match-inline-row-friend"><img class="hero-image" src="'+ data.image +'"></div>',
				'<div class="match-inline-row-friend"><div class="top-row-won-match">'+ data.friend.replace("/players/", "http://www.dotabuff.com/players/").replace('<a ', '<a class="tab-link"') +'</div><div class="bot-row"></div>',
				'<div class="match-inline-row-friend"><div class="top-row">'+ data.matches +'</div><div class="bot-row bar">'+ data.bar_matches +'</div></div>',
				'<div class="match-inline-row-friend"><div class="top-row">'+ data.winrate +'</div><div class="bot-row bar">'+ data.bar_winrate +'</div></div>'
			];
			$('div#friends div.match-row-friend:nth-of-type('+ count +')').append(div_append);
		})
	})

	attachListener(); // Attach the <a class="tab-link"> listener
}

function calculateTime (data) {
  // Convert and get dates
	var dDate = data.time.match(/datetime=".*"\s/);
		dDate = dDate[0].slice(10).slice(0, -2);;
		dDate = new Date(dDate);
	var nDate = new Date();

  // Calculate time difference
	var hoursDiff 	= Math.round((nDate - dDate) / 1000);
	var timeSince	= [{
			days: Math.floor(hoursDiff / 86400),
			hours: Math.floor(hoursDiff / 3600),
			minutes: Math.ceil(hoursDiff / 60),
			since: ""
		}];
	var endText;

	if (timeSince[0].days >= 365) {
		timeSince.since = Math.round(timeSince[0].days / 365); 
		if (timeSince.since == 1) { endText = " year ago" } else { endText = " years ago" };
	} else if (timeSince[0].days >= 30) {
		timeSince.since = Math.round(timeSince[0].days / 30);
		if (months == 1) { endText = " month ago" } else { endText = " months ago" };
	} else if (timeSince[0].days >= 1) {
		timeSince.since = timeSince[0].days;
		if (timeSince[0].days == 1) { endText = " day ago" } else { endText = " days ago" };
	} else if (timeSince[0].hours >= 1) {
		timeSince.since = timeSince[0].hours;
		if (timeSince[0].days == 1) { endText = " hour ago" } else { endText = " hours ago" };
	} else {
		timeSince.since = timeSince[0].minutes;
		if (timeSince[0].days <= 1) { endText = " minute ago" } else { endText = " minutes ago" };
	}
	timeSince.since = timeSince.since + endText;
	return timeSince.since;
}

function noPlayerID() {
  // Recommend Recache Float
	$('div#float').empty();
	$('div#float').prepend("<div id='no-player-id'></div>");
	$('div#float div#no-player-id').append('<div id="text">Could not find a Player ID.<br>Do you want to go to the options menu now?</div>');
	$('div#float div#no-player-id').append('<div id="options" class="option"><a id="yes" href="#"><b>Yes</b></a><a id="no" href="#"><b>No</b></a></div>');

	$('div#float').attr("class", "float");

  	$('body').css("opacity", "0.6");
	$('div#float').show();

	$('div#float div#no-player-id div#options #yes').on('click', function(event) {
		event.preventDefault();
		openTab("/options.html");
	});

	$('div#float div#no-player-id div#options #no').on('click', function(event) {
		event.preventDefault();
		removePopup();
	});

	$(document).on("click", function(event) {
		event.preventDefault();
		removePopup();
	});
}

// Function for removing the popup
function removePopup(from) {

	$('body').css("opacity", "1");
	$('div#float').hide();
	$('div#float').empty();
	$('div#float').css("left", null);
	$('div#float').css("top", null);
	$(document).off("click");
}

// Function that attaches the <a class="tab-link"> listener
function attachListener () {
	$('a.tab-link').on('click', function(event) {
		event.preventDefault();
		openTab(event.currentTarget.href)
	})
}

// Function that is run when a link is clicked 
function openTab(tabUrl) {
	var background = false;
	if(event) {
	  // If right-click return
		if(event.button == 2) {
			return;
		}
	  // if middle-click, metaKey or ctrlKey was pressed when clicking
		if(event.button == 1 || event.metaKey || event.ctrlKey) {
			background = true;
		}
	}
  // Create Tab
	chrome.tabs.create({
		url: tabUrl,
		selected: !background
	});
}
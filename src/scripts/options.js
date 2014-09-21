// Saves options to localStorage.
function save_options() {	
  // Player ID
	var select = document.getElementById("player-id");
	localStorage["player_id"] = select.value;

  // Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
	status.innerHTML = "";
	}, 1000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  // Restore Played ID Status
	var playerID = localStorage["player_id"];
	if (!playerID) {
		return;
	}
	var select = document.getElementById("player-id");
		select.value = playerID;
}

// Fetch player ID from Dotabuff
function fetchID() {
  // Check for login cookie
	chrome.cookies.get({url: "http://www.dotabuff.com", name: "_player_token"}, function(results) {
		if (!results) {
		  // Update status to let the user know that they need to login to use this.
			var status = document.getElementById("status");
			status.innerHTML = "<span style='color: red'>You need to login to Dotabuff in order to be able to fetch your PlayerID.</span>";
			setTimeout(function() {
			status.innerHTML = "";
			}, 5000);
		} else {
			$.ajax({     
				type: "GET",		
				url: "http://www.dotabuff.com",
				dataType: "HTML",
				async: false,
				success: function(data) {
					var playerID = data.match(/\/players\/[0-9]+/);
					if (!playerID) {
						return;
					}
					var select = document.getElementById("player-id");
						select.value = playerID[0].replace("/players/", "");
				}
			});
		}
	});
}


document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
document.querySelector('#fetchID').addEventListener('click', fetchID);
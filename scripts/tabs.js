// Function for Tabs and Tab Content
$(document).ready(function() {
	$('.tabs .tab-links a').on('click', function(e) {
		var currentAttrValue = $(this).attr('href');

	  // Show/Hide Tab Content
	 	$('.tabs ' + currentAttrValue).show().siblings().hide();

	  // Change current tab to active
	 	$(this).parent('li').addClass('active').siblings().removeClass('active');

	 	if (currentAttrValue == "#changelog") {
	 	  // Load Changelog from textfile
			$.get('changelog.txt', function(data) {

				data = data.replace(/\/\//, "<p>");
				data = data.replace(/\n\/\/ /g, "</p><p>");
				data = data + "</p>";
				data = data.replace(/\n/g, "<br>");

			  // Stylize version text
				data = data.replace(/Version.*/g, function(matched) { return '<span class="version">' + matched + '</span>'; });

			  // Paste text data and reverse order of paragraphs
				$('div#changelog-content').html(data);
				$('div#changelog-content').children().each(function(i, li) { $('div#changelog-content').prepend(li); })
			});
	 	}

	 	e.preventDefault();
	})
})
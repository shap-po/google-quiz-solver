chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	var activeTab = tabs[0];
	chrome.storage.local.get("SGFQ_grade", function (result) {
		var grade = result.SGFQ_grade;
		chrome.storage.local.get("SGFQ_maxGrade", function (result) {
			var maxGrade = result.SGFQ_maxGrade;
			setPopupContent(activeTab, grade, maxGrade);
		});
	});
});

function setPopupContent(activeTab, grade, maxGrade) {
	if (
		/^.+:\/\/docs\.google\.com\/forms\/.+\/viewform.*$/.test(activeTab.url)
	) {
		var fillButton = document.createElement("button");
		fillButton.innerText = "Fill form";
		fillButton.onclick = function () {
			chrome.tabs.sendMessage(
				activeTab.id,
				{ action: "fill" },
				function () {}
			);
		};
		document.body.appendChild(fillButton);
	} else if (
		/^.+:\/\/docs\.google\.com\/forms\/.*\/viewscore.*$/.test(activeTab.url)
	) {
		var grades = document.createElement("div");
		grades.id = "grades";
		document.body.appendChild(grades);

		var gradeInput = document.createElement("input");
		gradeInput.id = "grade";
		gradeInput.type = "number";
		if (grade != undefined) gradeInput.value = grade;
		else gradeInput.value = 10;
		gradeInput.onchange = function () {
			chrome.storage.local.set(
				{ SGFQ_grade: gradeInput.value },
				() => {}
			);
		};
		grades.appendChild(gradeInput);

		var gradeSeparator = document.createElement("span");
		gradeSeparator.innerText = "/";
		grades.appendChild(gradeSeparator);

		var maxGradeInput = document.createElement("input");
		maxGradeInput.id = "maxGrade";
		maxGradeInput.type = "number";
		if (maxGrade != undefined) maxGradeInput.value = maxGrade;
		else maxGradeInput.value = 12;
		maxGradeInput.onchange = function () {
			chrome.storage.local.set(
				{ SGFQ_maxGrade: maxGradeInput.value },
				() => {}
			);
		};
		grades.appendChild(maxGradeInput);

		var gradeButton = document.createElement("button");
		gradeButton.innerText = "Set grade";
		gradeButton.onclick = function () {
			chrome.tabs.sendMessage(
				activeTab.id,
				{
					action: "grade",
					grade: document.getElementById("grade").value,
					maxGrade: document.getElementById("maxGrade").value,
				},
				function () {}
			);
		};
		document.body.appendChild(gradeButton);

		var shuffleButton = document.createElement("button");
		shuffleButton.innerText = "Shuffle questions";
		shuffleButton.onclick = function () {
			chrome.tabs.sendMessage(
				activeTab.id,
				{ action: "shuffle" },
				function () {}
			);
		};
		document.body.appendChild(shuffleButton);
	} else {
		var unsupported = document.createElement("p");
		unsupported.innerText = "Unsupported page";
		document.body.appendChild(unsupported);
	}
}

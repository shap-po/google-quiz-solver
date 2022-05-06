var url = window.location.href;
if (/^.+:\/\/docs\.google\.com\/forms\/.+\/viewform.*$/.test(url)) {
	var finder = setInterval(function () {
		var parent = document.evaluate(
			"/html/body/div/div[2]/form/div[2]/div/div[3]/div[1]/div[1]",
			document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;
		if (parent) {
			clearInterval(finder);
			var fillButton = document.createElement("button");
			fillButton.className = "solver";
			fillButton.innerText = "Fill form";
			fillButton.onclick = function () {
				fillForm();
			};
			parent.appendChild(fillButton);
		}
	}, 100);
} else if (/^.+:\/\/docs\.google\.com\/forms\/.*\/viewscore.*$/.test(url)) {
	var finder = setInterval(function () {
		var parent = document.evaluate(
			"/html/body/div/div[2]/div[1]",
			document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;
		if (parent) {
			clearInterval(finder);

			var container = document.createElement("div");
			container.id = "container";
			parent.appendChild(container);

			var grades = document.createElement("div");
			grades.id = "grades";
			container.appendChild(grades);

			var gradeInput = document.createElement("input");
			gradeInput.className = "solver";
			gradeInput.id = "grade";
			gradeInput.type = "number";
			gradeInput.onchange = function () {
				chrome.storage.local.set({ grade: gradeInput.value }, () => {});
			};
			grades.appendChild(gradeInput);

			var gradeSeparator = document.createElement("span");
			gradeSeparator.innerText = "/";
			grades.appendChild(gradeSeparator);

			var maxGradeInput = document.createElement("input");
			maxGradeInput.className = "solver";
			maxGradeInput.id = "maxGrade";
			maxGradeInput.type = "number";
			maxGradeInput.onchange = function () {
				chrome.storage.local.set(
					{ maxGrade: maxGradeInput.value },
					() => {}
				);
			};
			grades.appendChild(maxGradeInput);

			chrome.storage.sync.get(["grade", "maxGrade"], function (result) {
				gradeInput.value = result.grade || 10;
				maxGradeInput.value = result.maxGrade || 12;
			});

			var gradeButton = document.createElement("button");
			gradeButton.className = "solver";
			gradeButton.innerText = "Set grade";
			gradeButton.onclick = function () {
				var grade = gradeInput.value;
				var maxGrade = maxGradeInput.value;
				setGrade(grade, maxGrade);
				shuffleQuestions();
				window.scrollTo(0, 0);
			};
			container.appendChild(gradeButton);
		}
	}, 100);
}

function fillForm() {
	var checkboxes = document.querySelectorAll('div[role="radio"]');
	for (i = 0; i < checkboxes.length; i++) checkboxes[i].click();
	var checkboxes = document.querySelectorAll('div[role="checkbox"]');
	for (i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].getAttribute("aria-checked") === "false") {
			checkboxes[i].click();
		}
	}
	var inputs = document.querySelectorAll('input[type="text"]');
	for (i = 0; i < inputs.length; i++) {
		inputs[i].value = "text";
		inputs[i].dispatchEvent(
			new Event("input", {
				view: window,
				bubbles: true,
				cancelable: true,
			})
		);
	}
}

function setGrade(grade, maxGrade) {
	var gradeElement = document.querySelectorAll(
		'span[aria-describedby="i1"]'
	)[0];
	var actualMax = gradeElement.innerText.split("/")[1] * 1;
	var actualGrade = Math.ceil((grade * actualMax) / maxGrade);
	gradeElement.innerText = `${actualGrade}/${actualMax}`;
}
function shuffleQuestions() {
	console.log("Shuffling questions");
	var questionsList = document.querySelectorAll('div[role="list"]')[0];
	var questions = questionsList.children;
	var questionsGood = [];
	for (let i = 0; i < questions.length; i++) {
		const question = questions[i];
		let grade = question.querySelectorAll('div[role="note"]')[0];
		if (grade !== undefined)
			if (grade.innerText[0] === "1") questionsGood.push(question);
	}
	questionsGood = shuffle(questionsGood);
	for (let i = 0; i < questionsGood.length; i++) {
		const question = questionsGood[i];
		questionsList.prepend(question);
	}
}
function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
	return array;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "fill") fillForm();
	else if (request.action === "grade")
		setGrade(request.grade, request.maxGrade);
	else if (request.action === "shuffle") shuffleQuestions();
	sendResponse({});
});

function fillForm() {
	var checkboxes = document.querySelectorAll('div[role="radio"]');
	for (i = 0; i < checkboxes.length; i++) checkboxes[i].click();
	var checkboxes = document.querySelectorAll('div[role="checkbox"]');
	for (i = 0; i < checkboxes.length; i++) checkboxes[i].click();

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

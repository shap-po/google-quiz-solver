var buttonElement = document.getElementsByClassName(
	"freebirdFormviewerViewHeaderTitle"
)[0];
buttonElement.onclick = function () {
	var list = document.getElementsByClassName(
		"freebirdFormviewerViewItemList"
	)[0];
	var elements = document.getElementsByClassName(
		"freebirdFormviewerViewNumberedItemContainer"
	);

	var graded = [];
	var ungraded = [];
	for (i = 0; i < elements.length; i++) {
		grade = elements[i].getElementsByClassName(
			"freebirdFormviewerViewItemsItemScore"
		)[0];
		if (grade != undefined) {
			grade = grade.innerHTML[0];
			if (grade > 0) graded.push(elements[i]);
			else ungraded.push(elements[i]);
		} else elements[i].remove();
	}
	shuffle(graded);
	shuffle(ungraded);
	graded.push.apply(graded, ungraded);
	for (i = 0; i < graded.length; i++) {
		list.appendChild(graded[i]);
	}

	let wantedGrade = prompt("Your grade");
	var gradeElement = document.getElementsByClassName(
		"freebirdFormviewerViewHeaderGradeFraction"
	)[0];
	var max = gradeElement.innerHTML.split("/")[1] * 1;
	var grade = Math.ceil((wantedGrade * max) / 12);
	gradeElement.innerHTML = `${grade}/${max}`;
};

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

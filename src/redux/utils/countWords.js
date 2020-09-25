const countWords = (songLyrics) => {
	const wordsCount = {};
	if (!songLyrics || !songLyrics.length) return wordsCount;
	songLyrics = songLyrics.toLowerCase();
	const sections = songLyrics.split('\n\n');
	sections.forEach((section) => {
		//set multiplier to influence weight
		const markerMatchingRegEx = /\[.+\]/;

		//trim punctuation, markers, & later, whitespace
		section = section.replace(markerMatchingRegEx, '');
		const punctuationMatchingRegEx = new RegExp('[.,/#!$%^*;:{}=`~()"]', 'g');
		section = section.replace(punctuationMatchingRegEx, '');

		const whiteSpaceRegEx = /\s+/g;
		const rawSectionWords = section.split(whiteSpaceRegEx); // Markers undetectable after this point.

		rawSectionWords.forEach((word) => {
			const existingCount = wordsCount[word];
			wordsCount[word] = existingCount ? existingCount + 1 : 1;
		});
	});

	return wordsCount;
};

export default countWords;

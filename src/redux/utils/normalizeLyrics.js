const normalizeLyrics = (songLyrics) => {
	songLyrics = songLyrics.toLowerCase();
	const sections = songLyrics.split('\n\n');
	const rawWords = sections.reduce((_rawWords, section) => {
		//set multiplier to influence weight
		const markerMatchingRegEx = /\[.+\]/;
		const marker = section.match(markerMatchingRegEx);
		let multiplier = 1;
		if (marker && marker[0] && [ '[chorus]', '[refrain]' ].includes(marker[0])) {
			multiplier = 3;
		}

		//trim punctuation, markers, & later, whitespace
		section = section.replace(markerMatchingRegEx, '');
		const punctuationMatchingRegEx = new RegExp('[.,/#!$%^*;:{}=`~()"]', 'g');
		section = section.replace(punctuationMatchingRegEx, '');

		const whiteSpaceRegEx = /\s+/g;
		const rawSectionWords = section.split(whiteSpaceRegEx); // Markers undetectable after this point.

		const filteredSectionWords = rawSectionWords.filter((word) => {
			const unwantedWords = [ 'and', 'but', 'the', 'to', 'if', 'it', 'of' ];
			if (unwantedWords.includes(word)) return false;
			return true;
		});

		//multiply words to influence weight
		let multipliedWords = [];
		for (var i = 0; i < multiplier; i++) {
			multipliedWords = [ ...multipliedWords, ...filteredSectionWords ];
		}
		return [ ..._rawWords, ...multipliedWords ];
	}, []);

	if (rawWords) {
		//count words, store results in obj
		const wordCount = rawWords.reduce(function(wordCount, word) {
			const currentCount = wordCount[word] + 1 || 1;
			wordCount[word] = currentCount;
			return wordCount;
		}, {});

		//convert counted words to cloud-friendly objects for rendering
		const normalizedLyrics = Object.entries(wordCount).map(([ word, count ]) => {
			return { text: word, size: 10 + count };
		});
		return normalizedLyrics;
	}
};

export default normalizeLyrics;
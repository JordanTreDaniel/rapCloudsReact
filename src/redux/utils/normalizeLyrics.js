const normalizeLyrics = (songLyrics) => {
	if (!songLyrics || !songLyrics.length) return [];
	songLyrics = songLyrics.toLowerCase();
	const sections = songLyrics.split('\n\n');
	const rawWords = sections.reduce((_rawWords, section) => {
		//set multiplier to influence weight
		const markerMatchingRegEx = /\[.+\]/;
		const marker = section.match(markerMatchingRegEx);
		const isChorus = marker && marker[0] && [ 'chorus', 'refrain' ].some((tag) => marker[0].match(tag));
		const multiplier = isChorus ? 3 : 1;

		//trim punctuation, markers, & later, whitespace
		section = section.replace(markerMatchingRegEx, '');
		const punctuationMatchingRegEx = new RegExp('[.,/#!$%^*;:{}=`~()"\']', 'g');
		section = section.replace(punctuationMatchingRegEx, '');

		const whiteSpaceRegEx = /\s+/g;
		const rawSectionWords = section.split(whiteSpaceRegEx); // Markers undetectable after this point.

		const filteredSectionWords = rawSectionWords.filter((word) => {
			const unwantedWords = [ 'and', 'but', 'the', 'to', 'if', 'it', 'of', 'at', '' ];
			if (unwantedWords.includes(word)) return false;
			return true;
		});

		//multiply words to influence weight
		if (isChorus) {
			for (let i = 1; i < multiplier; i++) {
				_rawWords.push(...filteredSectionWords);
			}
			return _rawWords;
		}

		return [ ..._rawWords, ...filteredSectionWords ];
	}, []);

	if (rawWords) {
		//count words, store results in obj
		// const wordCount = rawWords.reduce(function(wordCount, word) {
		// 	const currentCount = wordCount[word] + 1 || 1;
		// 	wordCount[word] = currentCount;
		// 	return wordCount;
		// }, {});

		// //convert counted words to cloud-friendly objects for rendering
		// const normalizedLyrics = Object.entries(wordCount).map(([ word, count ]) => {
		// 	return { text: word, size: 10 + count };
		// });
		return rawWords.join(' ');
	}
};

export default normalizeLyrics;

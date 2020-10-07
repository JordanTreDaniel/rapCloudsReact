export const classNames = (...classes) => {
	return classes.filter((c) => c).join(' ');
};

export const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max)) + 1;
};

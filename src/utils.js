export const classNames = (...classes) => {
	return classes.filter((c) => c).join(' ');
};

import { objekWisataData } from "./objekWisata";
import { kulinerData } from "./kuliner";
import { penginapanData } from "./penginapan";
import { olehOlehData } from "./olehOleh";
import { desaWisataData } from "./desaWisata";
import { biroPerjalananData } from "./biroTravel";

export {
	objekWisataData,
	kulinerData,
	penginapanData,
	olehOlehData,
	desaWisataData,
	biroPerjalananData,
};

export const getAllData = () => {
	return [
		...objekWisataData,
		...kulinerData,
		...penginapanData,
		...olehOlehData,
		...desaWisataData,
		...biroPerjalananData,
	];
};

export const getRecommendations = (limit = 5) => {
	return getAllData()
		.filter((item) => item.rating !== undefined)
		.sort((a, b) => b.rating - a.rating)
		.slice(0, limit);
};

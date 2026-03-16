import { eventData } from "./event";

// 🔹 export data satu-satu (kalau mau dipakai spesifik)
export {
	eventData,
};

// 🔹 helper: ambil SEMUA data
export const getAllData = () => {
	return [
		...eventData,
	];
};

// // 🔹 helper: rekomendasi (berdasarkan rating)
// export const getRecommendations = (limit = 5) => {
// 	return getAllData()
// 		.filter((item) => item.rating !== undefined)
// 		.sort((a, b) => b.rating - a.rating)
// 		.slice(0, limit);
// };




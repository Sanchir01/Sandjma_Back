export const returnProductObject = {
	images: true,
	id: true,
	name: true,
	price: true,
	slug: true,
	createdAt: true,
	description: true,
	category: { select: { id: true } }
}

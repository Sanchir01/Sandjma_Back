export const ReturnObjectFieldsColor = {
	include: {
		products: {
			select: {
				name: true,
				id: true,
				categoryId: true
			}
		}
	}
}

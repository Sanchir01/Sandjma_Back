import * as excel from 'exceljs'
import { CreateOrderInput } from 'src/order/dto/CreateOrder.input'

export async function createFileXlsx(
	createOrderInput: CreateOrderInput,
	phone: string,
	allPrice: number
) {
	const workbook = new excel.Workbook()
	const worksheet = workbook.addWorksheet('Заказ')
	const centering: Partial<excel.Column> = {
		alignment: {
			vertical: 'middle',
			horizontal: 'center'
		}
	}
	const centeringAndFont: Partial<excel.Column> = {
		alignment: {
			vertical: 'middle',
			horizontal: 'center'
		},
		font: {
			bold: true,
			size: 14
		}
	}
	worksheet.columns = [
		{
			header: 'Название товара',
			key: 'Название_товара',
			width: 40,
			style: centering
		},

		{
			header: 'цена товара',
			key: 'цена_товара',
			width: 20,
			style: centering
		},
		{
			header: 'количество',
			key: 'количество',
			width: 20,
			style: centering
		},
		{
			header: 'цвет товара',
			key: 'цвет_товара',
			width: 20,
			style: centering
		},
		{
			header: 'размер товара',
			key: 'размер_товара',
			width: 20,
			style: centering
		},
		{
			header: 'номер пользователя',
			key: 'номер_пользователя',
			width: 20,
			style: centeringAndFont
		},
		{
			header: 'итоговая цена',
			key: 'итоговая_цена',
			width: 20,
			style: centeringAndFont
		}
	]
	await createOrderInput.items.map(item => {
		worksheet.addRows([
			{
				Название_товара: item.productName,
				цена_товара: item.price,
				количество: item.quantity,
				цвет_товара: item.productColor,
				размер_товара: item.size
			}
		])
	})
	await worksheet.addRow({
		номер_пользователя: phone,
		итоговая_цена: allPrice
	})
	try {
		await workbook.xlsx.writeFile('./Заказ.xlsx')
		console.log('Файл сохранен успешно')
	} catch (er) {
		console.log('ошибка', er)
	}
}

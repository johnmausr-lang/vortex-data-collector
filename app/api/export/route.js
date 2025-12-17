// app/api/export/route.js
import { NextResponse } from 'next/server';
import { VORTEX_HEADERS } from '@/lib/constants';

// *** ВАЖНО: В реальном проекте, замените этот МОК на реальный запрос к вашей БД ***
// Этот массив имитирует данные, полученные из вашей БД
const MOCK_DB_DATA = [
  // Анкета 1: г.п. Федоровский (код 1), Ответ на V1=2, V2=1 и т.д.
  {
    ID: 1,
    P_SETTLEMENT: 1,
    V1: 2,
    V2: 1,
    V3: 4,
    Перем_22: 3,
    V4: 5,
    V5: 1,
    Q6_TEXT: "ЖКХ не работает как надо", // Текст для открытого вопроса
    V8: 2,
    V9: 3,
    V10: 2,
    V11: 1
  },
  // Анкета 2: г.п. Лянтор (код 4), Ответ на V1=1, V2=3 и т.д.
  {
    ID: 2,
    P_SETTLEMENT: 4,
    V1: 1,
    V2: 3,
    V3: 2,
    Перем_22: 1,
    V4: 3,
    V5: 4,
    Q6_TEXT: "Дороги плохие",
    V8: 6,
    V9: 4,
    V10: 1,
    V11: 4
  }
  // ... здесь будут все анкеты из вашей БД
];
// ******************************************************************************

/**
 * Генерирует CSV/TXT файл для загрузки в Vortex_DM.
 * @param {Array<object>} data - массив объектов анкет.
 * @returns {string} - строка в формате CSV/TXT с разделителем ';'
 */
function generateVortexCsv(data) {
  // 1. Создаем строку заголовка с кодами переменных Vortex
  const headerRow = VORTEX_HEADERS.join(';');

  // 2. Преобразуем каждую запись данных в строку с числовыми кодами
  const dataRows = data.map(row => {
    // Получаем значения по порядку, заданному в VORTEX_HEADERS
    const values = VORTEX_HEADERS.map(header => {
      let value = row[header] !== undefined ? row[header] : '';
      
      // Обработка текстовых полей: заменяем точки с запятой, чтобы не нарушать формат
      if (typeof value === 'string') {
          // Заменяем внутренние разделители (';') на что-то безопасное (например, ',') 
          // и оборачиваем текст в кавычки, чтобы сохранить его целостность
          value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    
    // Объединяем значения точкой с запятой
    return values.join(';');
  });

  // 3. Соединяем заголовок и данные
  return [headerRow, ...dataRows].join('\r\n'); // Используем \r\n для совместимости с Windows-системами
}

/**
 * GET маршрут для скачивания файла экспорта
 * URL: /api/export
 */
export async function GET(request) {
  // В реальном приложении здесь должна быть проверка аутентификации администратора!
  // const secret = request.headers.get('X-Admin-Secret');
  // if (secret !== process.env.ADMIN_SECRET_KEY) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }
  
  // В реальном приложении: const dbData = await fetchAllDataFromDB();
  const csvString = generateVortexCsv(MOCK_DB_DATA);
  
  // Создаем объект ответа с CSV-данными
  const response = new NextResponse(csvString, {
    status: 200,
    headers: {
      // Это критически важно: Content-Type для текстового файла и кодировка (Windows-1251 или UTF-8)
      'Content-Type': 'text/csv; charset=utf-8', 
      'Content-Disposition': 'attachment; filename="vortex_export_anket.txt"',
    },
  });

  return response;
}

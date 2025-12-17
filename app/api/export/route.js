import { NextResponse } from 'next/server';
import { VORTEX_HEADERS } from '@/lib/constants';

export async function GET() {
  try {
    // 1. Здесь будет запрос к вашей БД (например, Supabase или PostgreSQL)
    const surveys = [
      { ID: 1, P_SETTLEMENT: 4, V1: 1, V3: 2, V22: 1, V10: 1 }, // Пример данных
    ];

    // 2. Формируем CSV-строку с разделителем ";" (стандарт Vortex)
    const header = VORTEX_HEADERS.join(';');
    const rows = surveys.map(s => 
      VORTEX_HEADERS.map(h => s[h] || '').join(';')
    ).join('\n');

    const csvContent = `${header}\n${rows}`;

    // 3. Отправляем файл с заголовками, которые заставят браузер его скачать
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=windows-1251',
        'Content-Disposition': 'attachment; filename="vortex_data_2025.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка экспорта' }, { status: 500 });
  }
}

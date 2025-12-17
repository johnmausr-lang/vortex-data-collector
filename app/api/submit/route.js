import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // 1. Валидация: проверяем наличие обязательных полей (ID поселения)
    if (!data.P_SETTLEMENT) {
      return NextResponse.json({ error: 'Не выбрано поселение' }, { status: 400 });
    }

    // 2. Здесь логика сохранения в базу данных (PostgreSQL на Render.com)
    // Пример: await db.query('INSERT INTO surveys ...', [data.V1, data.V2, ...])
    
    console.log('Получена анкета для Vortex:', data);

    // Имитируем успешное сохранение
    return NextResponse.json({ 
      success: true, 
      message: 'Анкета успешно сохранена и готова к экспорту в Vortex' 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

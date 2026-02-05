import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Получаем данные формы
    const formRes = await db.query(
      'SELECT * FROM dynamic_forms WHERE id = $1 AND is_active = true',
      [id]
    );

    if (formRes.rows.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Получаем вопросы
    const questionsRes = await db.query(
      'SELECT * FROM form_questions WHERE form_id = $1 ORDER BY order_index ASC',
      [id]
    );

    return NextResponse.json({
      ...formRes.rows[0],
      questions: questionsRes.rows
    });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

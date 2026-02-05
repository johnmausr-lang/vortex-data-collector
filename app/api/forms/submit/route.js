import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  const client = await db.connect();
  try {
    const { formId, answers } = await request.json(); // answers = { question_id: value }

    await client.query('BEGIN');

    // 1. Создаем запись ответа (сессию)
    const respRes = await client.query(
      'INSERT INTO form_responses (form_id) VALUES ($1) RETURNING id',
      [formId]
    );
    const responseId = respRes.rows[0].id;

    // 2. Сохраняем ответы на вопросы
    for (const [qId, value] of Object.entries(answers)) {
      await client.query(
        'INSERT INTO response_answers (response_id, question_id, answer_value) VALUES ($1, $2, $3)',
        [responseId, qId, value]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Submit Error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  } finally {
    client.release();
  }
}

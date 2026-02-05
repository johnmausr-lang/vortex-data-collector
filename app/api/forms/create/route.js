import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  const client = await db.connect();
  try {
    const { title, description, questions } = await request.json();

    await client.query('BEGIN');

    // 1. Создаем саму форму
    const formRes = await client.query(
      `INSERT INTO dynamic_forms (title, description) VALUES ($1, $2) RETURNING id`,
      [title, description]
    );
    const formId = formRes.rows[0].id;

    // 2. Добавляем вопросы
    for (const [index, q] of questions.entries()) {
      await client.query(
        `INSERT INTO form_questions (form_id, question_text, question_type, options, order_index, required) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [formId, q.text, q.type, JSON.stringify(q.options || []), index, q.required]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true, id: formId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create Form Error:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  } finally {
    client.release();
  }
}

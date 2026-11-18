// The one route wrapper (AR13): logs only { event, code, id }, never input, headers or error text.
export class AppError extends Error {
  constructor(readonly code: string, readonly status = 400) { super(code); }
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function handle(event: string, run: () => Promise<Response>, id?: string): Promise<Response> {
  try {
    return await run();
  } catch (e) {
    const code = e instanceof AppError ? e.code : 'internal_error';
    console.log({ event, code, id });
    return json({ ok: false, error: { code } }, e instanceof AppError ? e.status : 500);
  }
}

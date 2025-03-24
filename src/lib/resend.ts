// By keeping process.env.RESEND_API_KEY in a separate file (@/lib/resend),
// you ensure that it's only accessed in one place.
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
// Resend does not maintain a persistent connection. so wont be an issue in dev time

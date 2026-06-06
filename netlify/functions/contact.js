const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const CONTACT_TO = process.env.CONTACT_TO || 'hello@alihemayed.com.au';
const CONTACT_FROM = process.env.CONTACT_FROM || 'Ali Hemayed Photography <onboarding@resend.dev>';

function parseBody(event) {
  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';

  if(contentType.includes('application/json')) {
    return JSON.parse(event.body || '{}');
  }

  const params = new URLSearchParams(event.body || '');
  return {
    name: params.get('name'),
    email: params.get('email'),
    message: params.get('message'),
    botField: params.get('bot-field')
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function wantsJson(event) {
  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
  return contentType.includes('application/json');
}

function respond(event, statusCode, payload) {
  if(!wantsJson(event) && statusCode >= 200 && statusCode < 300) {
    return {
      statusCode: 303,
      headers: { Location: '/success.html' },
      body: ''
    };
  }

  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };
}

exports.handler = async event => {
  if(event.httpMethod !== 'POST') {
    return respond(event, 405, { success: false, error: 'Method not allowed' });
  }

  if(!process.env.RESEND_API_KEY) {
    return respond(event, 500, { success: false, error: 'Missing RESEND_API_KEY' });
  }

  let body;
  try {
    body = parseBody(event);
  } catch(error) {
    return respond(event, 400, { success: false, error: 'Invalid request body' });
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  const botField = String(body.botField || '').trim();

  if(botField) {
    return respond(event, 200, { success: true });
  }

  if(!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond(event, 400, { success: false, error: 'Please provide a valid name, email, and message.' });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const resendResponse = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `Photography enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h2>New photography enquiry</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `
    })
  });

  if(!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error('Resend error:', errorText);
    return respond(event, 502, { success: false, error: 'Email provider failed' });
  }

  return respond(event, 200, { success: true });
};

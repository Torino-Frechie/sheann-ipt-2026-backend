export default async function sendEmail({ to, subject, html }: any) {
    const payload = {
        from: 'onboarding@resend.dev',
        to: to, // Use the 'to' parameter for the recipient
        subject: subject,
        html: html,
    };

     ._API_KEY is missing from env 

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Resend API Error details:', JSON.stringify(data));
        r(err) {
        console.error('Send email error:', err);
        throw err;
    }
}
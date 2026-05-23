export default async function sendEmail({ to, subject, html }: any) {
    const authorizedEmail = 'frechieannt@gmail.com';
    const modifiedHtml = `<p><strong>Note:</strong> This message was intended for: ${to}</p><hr>${html}`;

    const payload = {
        from: 'onboarding@resend.dev',
        to: 'frechieannt@gmail.com',
        subject: `[TEST] ${subject}`,
        html: modifiedHtml,
    };

    console.log('Sending email payload:', JSON.stringify(payload));
    console.log('API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('API Key preview:', process.env.RESEND_API_KEY?.substring(0, 10));

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('Resend full response:', JSON.stringify(data));

        if (!response.ok) {
            throw new Error(`Email failed: ${JSON.stringify(data)}`);
        }

        console.log('Email sent successfully');
    } catch (err) {
        console.error('Send email error:', err);
        throw err;
    }
}
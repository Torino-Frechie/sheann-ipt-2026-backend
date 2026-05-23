export default async function sendEmail({ to, subject, html }: any) {
    const payload = {
        from: 'onboarding@resend.dev',
        to: to, // Use the 'to' parameter for the recipient
        subject: subject,
        html: html,
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
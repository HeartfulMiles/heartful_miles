import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
    const body = await request.json();

    console.log(body);
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
        params: {
            refresh_token: process.env.NEXT_PUBLIC_REFRESH_TOKEN,
            client_id: process.env.NEXT_PUBLIC_CLIENTID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            grant_type: 'refresh_token',
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    console.log(response.data.access_token);
    const result = await axios.post(
        `https://sheets.googleapis.com/v4/spreadsheets/1LqLvgka1u1W2jFeV0oLmdFHYMS4atVTP-DVFLtFyqCI/values/Sheet1!A:G:append`,
        {
            values: [
                [body.name, body.phone, body.email, body.baseLocation, body.tripDestination, body.budget, body.numberOfTravelers, body.startDate, body.endDate, body.specialRequirements]
            ]
        },
        {
            params: {
                valueInputOption: 'USER_ENTERED',
            },
            headers: {
                Authorization: `Bearer ${response.data.access_token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    // Send email after successful spreadsheet append
    if (result.status === 200) {
        try {
            await sendEmail(body, response.data.access_token);
            return NextResponse.json({ message: "Your request has been submitted. Our team will get back to you shortly.", data: '' });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return NextResponse.json({ message: "Your request has been submitted to our spreadsheet, but we couldn't send a confirmation email. Our team will get back to you shortly.", data: '' });
        }
    } else {
        return NextResponse.json({ message: "Something went wrong. Please try again later.", data: result.data });
    }
}

async function sendEmail(body: any, accessToken: string) {
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
        "175588890607-glfh2iofjv1arqbk71lqc2ur1ge8dhip.apps.googleusercontent.com",
        "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"
    );
    
    // Set the access token
    oauth2Client.setCredentials({
        access_token: accessToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    // Create email content
    const emailContent = `
        <html>
        <body>
            <h2>Travel Request Confirmation</h2>
            <p>Dear ${body.name},</p>
            <p>Thank you for submitting your travel request. We have received the following details:</p>
            <ul>
                <li><strong>Name:</strong> ${body.name}</li>
                <li><strong>Phone:</strong> ${body.phone}</li>
                <li><strong>Email:</strong> ${body.email}</li>
                <li><strong>Base Location:</strong> ${body.baseLocation}</li>
                <li><strong>Trip Destination:</strong> ${body.tripDestination}</li>
                <li><strong>Budget:</strong> ${body.budget}</li>
                <li><strong>Number of Travelers:</strong> ${body.numberOfTravelers}</li>
                <li><strong>Start Date:</strong> ${body.startDate}</li>
                <li><strong>End Date:</strong> ${body.endDate}</li>
                <li><strong>Special Requirements:</strong> ${body.specialRequirements}</li>
            </ul>
            <p>Our team will review your request and get back to you within 24-48 hours.</p>
            <p>Best regards,<br>Heartful Miles</p>
        </body>
        </html>
    `;

    // Create email message
    const message = [
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `To: ${body.email}`,
        'From: heartfulmiles@gmail.com', // Replace with your Gmail address
        'Bcc: heartfulmiles@gmail.com', // Replace with the email you want to BCC
        'Subject: Travel Request Confirmation',
        '',
        emailContent
    ].join('\n');

    // Encode the message in base64
    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send the email
    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage
        }
    });

    console.log('Email sent successfully to:', body.email);
}
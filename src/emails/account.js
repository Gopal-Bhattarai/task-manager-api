const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gbhattarai55@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Dear ${name}, Welcome to the App.  Let us know how you get along with the app. `
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gbhattarai55@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}, we are sad you are leaving us. Help us what we can do to connect with us.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
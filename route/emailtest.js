var nodemailer = require("nodemailer");
var config = require("../sys/config");

console.log(config.config.email.pwd);
var transport = nodemailer.createTransport({
    host: "smtp.exmail.qq.com", // hostname
    secure: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: "noreplay@zhuwenlong.com",
        pass: config.config.email.pwd
    }
});

var mailOptions = {
    from: "Mofei<noreplay@zhuwenlong.com>",
    to: '13761509829@163.com',
    subject: 'testit',
    html: 'html'
}

transport.sendMail(mailOptions, function() {
    console.log(arguments);
    console.log('email send');
    transport.close();
});

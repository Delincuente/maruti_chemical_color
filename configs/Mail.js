const Configs = require('./config');

exports.provider = "smtpout.secureserver.net";//"smtp"; // provider name : gmail, smtp, sendmail
// mail configuration for gmail or smtp
exports.hostName = "email.marutichemex.com";
exports.port = 465;//587;
exports.isSecure = true;//false; // true for 465, false for other ports
exports.username = "info@marutichemex.com";
exports.password = "XrmE!T^E&x+B9er";
exports.fromEmail = "no-reply@marutichemex.com";
exports.adminEmail = "info@marutichemex.com";

// mail configuration for sendmail
exports.sendMailNewline = "unix"; // either ‘windows’ or ‘unix’ (default). Forces all newlines in the output to either use Windows syntax <CR><LF> or Unix syntax <LF>
exports.sendMailPath = "/usr/sbin/sendmail"; //  path to the sendmail command (defaults to ‘sendmail’)

exports.userInquiry = 'User Inquiry';
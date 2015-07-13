'use strict';

/**
 * @file NewMe Mailer
 * @author Nestor Bermudez <nestor.bermudez@agilityfeat.com>
 * @version 0.1
 */

var path       = require('path');
var smtpapi    = require('smtpapi');
var nodemailer = require('nodemailer');
var handlebars = require('express-handlebars');
var hbs        = require('nodemailer-express-handlebars');

var config     = require('./config');

var settings  = {
  host: 'smtp.sendgrid.net',
  port: parseInt(587, 10),
  requiresAuth: true,
  auth: {
    user: config.get('SENDGRID_USERNAME'),
    pass: config.get('SENDGRID_PASSWORD')
  }
};

var viewEngine = handlebars.create({});
var smtpTransport = nodemailer.createTransport(settings);

var hbsOptions = {
  viewEngine: viewEngine,
  viewPath: path.resolve(__dirname, '../views/mailer'),
  extName: '.hbs'
};

smtpTransport.use('compile', hbs(hbsOptions));


function Mailer() {

}

/**
 * It sends an email to all @recipients to remind them that the event
 * they RSVP'd for is about to start.
 *
 * @param {String} eventName - name of the event that is about to start
 * @param {String} eventDate - timestamp when the event is scheduled to start
 * @param {Array} recipients - array of objects with email and name keys.
 */
Mailer.prototype.eventStartReminderOld = function (eventName, eventDate, recipients) {
  var recipientEmails = recipients.map(function(rec) { return rec.email; });
  var recipientNames = recipients.map(function(rec) { return rec.name });
  var header = new smtpapi();
  var mailOptions;

  header.addSubstitution('%name%', recipientNames);
  header.setTos(recipientEmails);
  header.setCategories(['newme', 'confirmation', 'rsvp']);

  mailOptions = {
    from: 'no-reply@newme.com',
    to: 'no-reply@newme.com',
    subject: ['NewMe:', eventName, 'is about to start'].join(' '),
    template: 'start_reminder',
    context: {
      eventName: eventName,
      eventDate: eventDate
    },
    headers: { 'x-smtpapi': header.jsonString() }
  };

  smtpTransport.sendMail(mailOptions, function(err, response) {
    smtpTransport.close();

    if (err) {
      console.log(err);
    }
    else {
      console.log('Message sent: ');
      console.log('-------------------------');
      console.log('Accepted: ' + response.accepted);
      console.log('Rejected: ' + response.rejected);
      console.log('Response: ' + response.response);
      console.log('Envelope: ' + JSON.stringify(response.envelope));
      console.log('MessageId: ' + response.messageId);
    }
  });
};


/**
 * It sends an email to all recipients that RSVP'd for the event with @eventId
 *
 * @param {String} eventId - id of the event that is about to start
 * @param {Function} callback - function to be called once the process is done.
 */
Mailer.prototype.eventStartReminder = function (eventId, callback) {
  console.log('EVENT_ID: ', eventId);
  callback();
};

module.exports = Mailer;

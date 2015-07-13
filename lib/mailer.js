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
 * It sends an email to all recipients that RSVP'd for the event with @eventId
 *
 * @param {String} eventId - id of the event that is about to start
 * @param {Function} callback - function to be called once the process is done.
 */
Mailer.prototype.eventStartReminder = function (eventId, callback) {
  var Event = require("./models/event");
  var _this = this;
  Event.findOne({ "_id": eventId })
    .populate('rsvps', 'email name')
    .exec(function(err, event) {
      if (err) {
        console.log("Error while querying for event id " + eventId);
        return;
      }
      var options = _this.startReminderMailOptions(event);
      smtpTransport.sendMail(options, function(err, response) {
        _this.sendMailCallback(err, response);
        callback();
      });
    });
};

/** HELPER METHODS **/

/**
 * It creates the mail options that are needed to call sendMail over the transport
 *
 * @param {Object} event - database record with the event information
 * @returns {Object} - mailOptions
 */
Mailer.prototype.startReminderMailOptions = function (event) {
  var users = event.rsvps;
  var eventName = event.name;

  var recipientEmails = users.map(function(user) { return user.email; });
  var recipientNames = users.map(function(user) { return user.name });
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
      eventDate: event.date_time_start
    },
    headers: { 'x-smtpapi': header.jsonString() }
  };

  return mailOptions;
};

/**
 * Callback function that logs into console some info after delivery
 *
 * @param {Object} err - error if something went wrong
 * @param {Object} response - delivery info if successfully sent
 */
Mailer.prototype.sendMailCallback = function (err, response) {
  if (err) {
    console.log('Error in sendMail');
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
};

module.exports = Mailer;

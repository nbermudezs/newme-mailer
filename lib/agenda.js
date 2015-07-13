'use strict';

var jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : ['email'];
var Agenda = require('agenda');
var agenda = new Agenda();

/* Agenda config */
agenda.database('localhost:27017/agenda-newme', 'agendaJobs');
agenda.processEvery('1 minute');

jobTypes.forEach(function(type) {
  require('./jobs/' + type)(agenda);
});

if(jobTypes.length) {
  console.log('Agenda starting...');
  agenda.start();
}

module.exports = agenda;

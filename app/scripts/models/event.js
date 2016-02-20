/*global define*/

define([
  'underscore',
  'backbone'
], function (_, Backbone) {
  'use strict';

  var EventModel = Backbone.Model.extend({
    url: '',

    initialize: function() {
    },

    defaults: {
        name: 'Untitled Event',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
        type: '',
        host: '',
        guests: '',
        message: ''
    }    
  });

  return EventModel;
});

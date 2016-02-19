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
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

  return EventModel;
});

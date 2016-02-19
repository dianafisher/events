/*global define*/

define([
  'underscore',
  'backbone',
  'models/Event',
  'firebase',
  'backbonefire'
], function (_, Backbone, EventModel) {
  'use strict';

  var EventCollection = Backbone.Collection.extend({
    model: EventModel,

    // Where to save all of the events
    url: 'https://burning-torch-7549.firebaseio.com/events',

    // Events are sorted by startDate (earliest first).
    comparator: function(model) {
      return -model.get('startDate');
    }
  });

  return EventCollection;
});

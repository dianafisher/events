/*global define*/

define([
  'underscore',
  'backbone',
  'models/Event'
], function (_, Backbone, EventModel) {
  'use strict';

  var EventCollection = Backbone.Collection.extend({
    model: EventModel
  });

  return EventCollection;
});

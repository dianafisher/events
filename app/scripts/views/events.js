/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'templates',
  'views/event'  
], function ($, _, Backbone, JST, EventView) {
  'use strict';

  var EventsView = Backbone.View.extend({
    template: JST['app/scripts/templates/events.ejs'],

    tagName: 'div',

    id: '',

    className: 'events-view',

    events: {},

    initialize: function () {
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'reset', this.render);

      this.collection.fetch();
    },

    render: function () {
      this.$el.html(this.template());
      
      _.each(this.collection.models, function(ev){
          // console.log(ev);
          var view = new EventView({ model: ev });
          var list = $('#event-list', this.el);
          list.append(view.render().el);
      }, this);

      return this;
    },

    // Add a single event to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function (data) {
        console.log(data);
        var view = new EventView({ model: data });
        var list = $('#event-list', this.el);
        list.append(view.render().el);
    }

  });

  return EventsView;
});

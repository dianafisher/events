/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'templates'
], function ($, _, Backbone, JST) {
  'use strict';

  var HomeView = Backbone.View.extend({
    template: JST['app/scripts/templates/home.ejs'],

    tagName: 'div',

    id: '',

    className: 'home-view',

    events: {},

    initialize: function () {
      
    },

    render: function () {
      this.$el.html(this.template());
      return this;
    }
  });

  return HomeView;
});

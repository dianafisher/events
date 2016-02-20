/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'templates'
], function ($, _, Backbone, JST) {
  'use strict';

  var EventDetailsView = Backbone.View.extend({
    template: JST['app/scripts/templates/event_details.ejs'],

    tagName: 'div',

    id: '',

    className: '',
   
    events: {},

    initialize: function () {
    
    },

    render: function () {
        // Set the event icon based on the type.
        var type = this.model.attributes.type;
        var eventIcon = this.iconForType(type);

        this.model.attributes.event_icon = eventIcon;

        this.model.attributes.dateStr = this.formatDate(this.model.attributes.startDate);
        this.model.attributes.timeStr = this.formatTime(this.model.attributes.startTime);
        this.model.attributes.endDateStr = this.formatDate(this.model.attributes.endDate);
        this.model.attributes.endTimeStr = this.formatTime(this.model.attributes.endTime);
        this.$el.html(this.template(this.model.attributes));

        return this;
    },   

    iconForType: function(type) {
        if (type === 'Birthday Party') {
            return 'fa-gift';
        } else if (type === 'Anniversary') {
           return 'fa-diamond';
        } else if (type === 'Wedding') {
           return 'fa-heart';
        } else if (type === 'Graduation') {
           return 'fa-graduation-cap';
        } else if (type === 'Conference Talk') {
           return 'fa-users';
        } else if (type === 'Sporting Event') {
            return 'fa-futbol-o';
        } else if (type === 'Concert') {
            return 'fa-music';
        } else {
            return 'fa-calendar';
        }
    },

    formatDate: function(date) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dateObject = new Date(date);
        var dateStr = months[dateObject.getMonth()] + ' ' + dateObject.getDay() + ', ' + dateObject.getFullYear();
        return dateStr;
    },

    formatTime: function(time) {

        var t = time.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
        var hours = parseInt(t[1], 10);
        var minutes = t[2];

        // Determine the suffix from the hours.
        var suffix = (hours >= 12) ? 'PM' : 'AM';
        hours = ((hours + 11) % 12 + 1);

        //only -12 from hours if it is greater than 12 (if not back at mid night)
        hours = (hours > 12) ? hours - 12 : hours;

        //if 00 then it is 12 am
        hours = (hours === '00') ? 12 : hours;

        var timeStr = hours + ':' + minutes + ' ' + suffix;
        return timeStr;
    }    
   
  });

  return EventDetailsView;
});

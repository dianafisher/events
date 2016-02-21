/*global define*/
/*global google*/
/* jshint undef: false, unused: false, latedef:false */

define([
  'jquery',
  'underscore',
  'backbone',
  'templates',
  'collections/event'
], function ($, _, Backbone, JST, Events) {
  'use strict';

  var CreateEventView = Backbone.View.extend({
    template: JST['app/scripts/templates/create_event.ejs'],

    tagName: 'div',

    id: '',

    className: 'create-event-view',

    // DOM events.
    events: {
        'focus #inputLocation': 'geolocate',
        'blur #inputName': 'validateName',
        'blur #startDate': 'validateStartDate',
        'blur #startTime': 'validateStartTime',
        'blur #endDate': 'validateEndDate',
        'blur #endTime': 'validateEndTime',
        'blur #inputLocation': 'validateLocation',
        'blur #inputType': 'validateType',
        'blur #inputHost': 'validateHost',
        'blur #inputGuests': 'validateGuests',
        'click #add_guest': 'addGuest',
        'click #formErrorAlert': 'alertDismissed',

        'submit': 'createEvent'
    },

        initialize: function () {
        // console.log('login view initialize');
        this.nameHasErrors = false;
        this.guestList = [];        
    },

    render: function () {
        // console.log('render CreateEventView');
        this.$el.html(this.template());

        return this;
    },

    // Redirect to the event list page.
    redirect: function() {
         Backbone.history.navigate('#events', {trigger: true});
    },

    validateName: function(e) {
        e.preventDefault();
        this.eventName = this.$('#inputName').val().trim();
        // console.log(this.eventName);
        if (this.eventName.length === 0) {
            this.$('#name-group').addClass('has-error');
            this.$('#name-help').html('Please enter a name for the event.');
            this.nameHasErrors = true;
        } else {
            this.$('#name-group').removeClass('has-error');
            this.$('#name-help').html('');
            this.nameHasErrors = false;
        }
    },

    validateStartDate: function(e) {
        e.preventDefault();
        this.startDate = this.$('#startDate').val();

        if (this.startDate.length === 0) {
            this.$('#start-date-group').addClass('has-error');
            this.$('#start-date-help').html('Please enter a start date for the event.');
            this.startDateErrors = true;
        } else {
            this.$('#start-date-group').removeClass('has-error');
            this.$('#start-date-help').html('');
            this.startDateErrors = false;
        }
    },

    validateStartTime: function(e) {
      e.preventDefault();
      this.startTime = this.$('#startTime').val();
      // console.log(this.startTime);

      if (this.startTime.length === 0) {
          this.$('#start-date-group').addClass('has-error');
          this.$('#start-date-help').html('Please enter a start time for the event.');
          this.startTimeErrors = true;
      } else {
          this.$('#start-date-group').removeClass('has-error');
          this.$('#start-date-help').html('');
          this.startTimeErrors = false;
      }
    },

    validateEndDate: function(e) {
      e.preventDefault();
      this.endDate = this.$('#endDate').val();
      // console.log(this.endDate);
      if (this.endDate.length === 0) {
          this.$('#end-date-group').addClass('has-error');
          this.$('#end-date-help').html('Please enter a end date for the event.');
          this.endDateErrors = true;
      }
      else {
          // Check that end date is not before start date.
          var start = new Date(this.startDate);
          var end = new Date(this.endDate);

          if (end.getTime() < start.getTime()) {
              this.$('#end-date-group').addClass('has-error');
              this.$('#end-date-help').html('End date must be after start date.');
              this.endDateErrors = true;
          } else {
              this.$('#end-date-group').removeClass('has-error');
              this.$('#end-date-help').html('');
              this.endtDateErrors = false;
          }
      }
    },

    validateEndTime: function(e) {
        e.preventDefault();

        this.endTime = this.$('#endTime').val();
        // console.log(this.endTime);

        if (this.endTime.length === 0) {
            this.$('#end-date-group').addClass('has-error');
            this.$('#end-date-help').html('Please enter a end time for the event.');
            this.endTimeErrors = true;
        } else {
            // If the event starts and ends on the same day, check that the end time is after the start time
            var startDate = new Date(this.startDate);
            var endDate = new Date(this.endDate);

            var time_start = this.startTime.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
            var hours = parseInt(time_start[1], 10);
            var minutes = parseInt(time_start[2], 10);
            startDate.setHours(hours);
            startDate.setMinutes(minutes);

            var time_end = this.endTime.match(/(\d+)(?::(\d\d))?\s*(p?)/i);

            var h = parseInt(time_end[1], 10);
            var m = parseInt(time_end[2], 10);

            endDate.setHours(h);
            endDate.setMinutes(m);

            // console.log('start date', startDate);
            // console.log('end date', endDate);

            if (endDate.getTime() <= startDate.getTime()) {
                this.$('#end-date-group').addClass('has-error');
                this.$('#end-date-help').html('End time must be after start time.');
                this.endTimeErrors = true;
            }
            else {
                this.$('#end-date-group').removeClass('has-error');
                this.$('#end-date-help').html('');
                this.endTimeErrors = false;
            }
        }
    },

    validateLocation: function(e) {
        this.eventLocation = this.$('#inputLocation').val();
        // console.log(this.eventLocation);
        if (this.eventLocation.length === 0) {
            this.$('#location-group').addClass('has-error');
            this.$('#location-help').html('Please enter a location for the event.');
            this.locationsErrors = true;
        } else {
            this.$('#location-group').removeClass('has-error');
            this.$('#location-help').html('');
            this.locationsErrors = false;
        }
    },

    validateType: function(e) {
        this.eventType = this.$('#inputType').val();
        // console.log('type', this.eventType);
        if (this.eventLocation.length === 0) {
            this.$('#type-group').addClass('has-error');
            this.$('#type-help').html('Please enter an event type.');
            this.typeErrors = true;
        } else {
            this.$('#type-group').removeClass('has-error');
            this.$('#type-help').html('');
            this.typeErrors = false;
        }
    },

    validateHost: function(e) {
        this.eventHost = this.$('#inputHost').val();
        // console.log(this.eventHost);
        if (this.eventLocation.length === 0) {
            this.$('#host-group').addClass('has-error');
            this.$('#host-help').html('Please enter a host for the event.');
            this.hostErrors = true;
        } else {
            this.$('#host-group').removeClass('has-error');
            this.$('#host-help').html('');
            this.hostErrors = false;
        }
    },

    validateGuests: function(e) {
        if (this.guestList.length === 0) {
            this.$('#guests-group').addClass('has-error');
            this.$('#guests-help').html('Please add an email address for each guest.');
            this.guestsHasErrors = true;
        }
        else {
            this.$('#guests-group').removeClass('has-error');
            this.$('#guests-help').html('');
            this.guestsHasErrors = false;
        }
    },

    addGuest: function(e) {
       var guest = this.$('#inputGuests').val();
       // console.log('adding', guest);

       var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       // Make sure the guest input field contains a valid email address.
        if (guest.length === 0) {
            this.$('#guests-group').addClass('has-error');
            this.$('#guests-help').html('Please add an email address for each guest.');
            this.guestsHasErrors = true;
        } else if (!re.test(guest)) {
            this.$('#guests-group').addClass('has-error');
            this.$('#guests-help').html('Please enter a valid email address.');
            this.guestsHasErrors = true;
        } else {
            this.$('#guests-group').removeClass('has-error');
            this.$('#guests-help').html('');
            this.guestsHasErrors = false;
            // Add the email address to the guest list.
            this.guestList.push(guest);
            this.$('#guest_list').append('<li id="guest_item">' + guest + '</li>');
        }
    },

    showErrorAlert: function() {
      $('#formErrorAlert').show();
    },
     
     alertDismissed: function() {      
      $('#formErrorAlert').hide();
     },

     showSuccessAlert: function() {
       $('#formSuccessAlert').show();
     },
     
    containsErrors: function() {
      return (this.guestsHasErrors || this.hostErrors || this.typeErrors || this.locationsErrors || this.endTimeErrors || this.endDateErrors || this.startTimeErrors || this.startDateErrors || this.nameHasErrors);
    },

     createEvent: function(e) {        
        console.log('create event');

        // Validate all fields.
        this.validateName(e);
        this.validateStartDate(e);
        this.validateStartTime(e);
        this.validateEndDate(e);
        this.validateEndTime(e);
        this.validateLocation(e);
        this.validateType(e);
        this.validateHost(e);
        this.validateGuests(e);

        // Make sure there are not any errors before creating the event.        
        if (!this.containsErrors()) {
          var message = this.$('#inputMessage').val().trim();
          // Save the new event to the database.
          var attributes = {
              name: this.eventName,
              startDate: this.startDate,
              startTime: this.startTime,
              endDate: this.endDate,
              endTime: this.endTime,
              location: this.eventLocation,
              type: this.eventType,
              host: this.eventHost,
              guests: this.guestList,
              message: message
          };
          Events.create(attributes);
          this.showSuccessAlert();
          // redirect to the event list page.
          this.redirect();  
        }
        else {
          console.log('form has errors');
          this.showErrorAlert();
        }
        
    }
  });

  return CreateEventView;
});






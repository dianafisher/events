/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'templates',
  'firebase' 
], function ($, _, Backbone, JST, Firebase) {
  'use strict';

  var LoginView = Backbone.View.extend({
    template: JST['app/scripts/templates/login.ejs'],

    tagName: 'div',

    id: '',

    className: 'login-view',

    // DOM events.
    events: {
        'submit': 'loginUser'
    },

    initialize: function () {
      
    },

    render: function () {
      this.$el.html(this.template());
      return this;
    },

    loginUser: function(e) {
        e.preventDefault();

        var email = this.$('#inputEmail').val().trim();
        var password = this.$('#inputPassword').val().trim();
        var self = this;

        var firebaseRef = new Firebase('https://burning-torch-7549.firebaseio.com');
        // Log the user in using Firebase authentication.
        firebaseRef.authWithPassword({
            email: email,
            password: password
        }, function(error, authData) {
            if (error) {
                console.log('login failed!', error);
                self.$('#login-help').html('Failed to log in.  Please try again.');
            } else {
                console.log('Authenticated successfully with payload:', authData);
                self.$('#login-help').html('Success!  Redirecting...');
                self.redirect();
            }
        }, {
            remember: 'sessionOnly'
        });
    },

    // Redirect to the event list page.
    redirect: function() {
      Backbone.history.navigate('#events', {trigger: true});
    }

  });

  return LoginView;
});

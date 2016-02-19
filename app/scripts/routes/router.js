/*global define*/

define([
  'jquery',
  'backbone',
  'collections/event',
  'views/home',
  'views/login',
  'views/create_account',
  'views/create_event',
  'views/events',
  'views/event_details'
], function ($, Backbone, Events, HomeView, LoginView, CreateAccountView, CreateEventView, EventsView, EventDetailsView) {
  'use strict';

  var RouterRouter = Backbone.Router.extend({
    routes: {
        '': 'index',
        'signup': 'createAccount',
        'login': 'login',
        'events': 'showEvents',
        'events/new': 'createEvent',
        'events/show/:id': 'eventDetails'
    },

    initialize: function() {
        // console.log('initialized');

        // Grab the div for the app.  This is where all views will go.
        this.$app = $('#appView');
    },

    index: function() {
        var homeView = new HomeView();
        // this.$app.html(homeView.render().el);
        this.showView(homeView);
    },

    /* Removes the current view and replaces it with view.  Then reassigns currentView.*/
    showView: function(view) {
        if (this.currentView) {
            this.currentView.remove();
        }
        this.$app.html(view.render().el);
        this.currentView = view;
    },

    createAccount: function() {
        // console.log('create account..');
        var accountView = new CreateAccountView();
        this.showView(accountView);
    },

    login: function() {
        var loginView = new LoginView();
        this.showView(loginView);
    },

    createEvent: function() {
        var createEventView = new CreateEventView();
        this.showView(createEventView);
    },

    showEvents: function() {
        // console.log('showEvents');
        var self = this;
        Events.fetch({
            success: function(data) {
                console.log(data);
                var eventsView = new EventsView({ collection: Events });
                self.showView(eventsView);
            },
            error: function(model, xhr, options) {
                console.log(xhr.status);
                console.log(xhr.responseText);
                console.log(options);
            }
        });
    },

    eventDetails: function(eventId) {
        var model = Events.get(eventId);
        // console.log(model);
        if (model) {
            var detailsView = new EventDetailsView({model: model});
            this.showView(detailsView);
        }
    }

  });

  return RouterRouter;
});

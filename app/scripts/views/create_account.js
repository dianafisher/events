/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'templates',
  'firebase'  
], function ($, _, Backbone, JST, Firebase) {
  'use strict';

  var CreateAccountView = Backbone.View.extend({
    template: JST['app/scripts/templates/create_account.ejs'],

    tagName: 'div',

    id: '',

    className: 'accont-view',

    // DOM events.
    events: {
        'keyup #inputPassword': 'validatePassword',
        'keyup #repeatPassword': 'validateRepeatedPassword',
        'blur #inputName': 'validateName',
        'blur #inputEmail': 'validateEmail',
        'submit': 'createUser'
    },

    initialize: function () {
       this.nameHasErrors = false;
        this.emailHasErrors = false;
        this.passwordHasErrors = false;
        this.repeatPasswordHasErrors = false;
        // test password = Aa!2nnnnnnnnnnnnn 

        // Get a reference to the Fireabse database.
        this.firebaseRef = new Firebase('https://burning-torch-7549.firebaseio.com');               
    },

    render: function () {
      this.$el.html(this.template());

      this.$inputPassword = this.$('#inputPassword');
      this.$repeatPassword = this.$('#repeatPassword');

      return this;
    },

    validateName: function(e) {
        e.preventDefault();
        this.username = this.$('#inputName').val().trim();
        // console.log(this.username);
        if (this.username.length === 0) {
            this.$('#name-group').addClass('has-error');
            this.$('#name-help').html('Please enter a name.');
            this.nameHasErrors = true;
        } else {
            this.$('#name-group').removeClass('has-error');
            this.$('#name-help').html('');
            this.nameHasErrors = false;
        }
    },

    validateEmail: function(e) {
        e.preventDefault();
        this.email = this.$('#inputEmail').val().trim();
        // console.log(this.email);
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // Check for a valid email address.
        if (this.email.length === 0) {
            this.$('#email-group').addClass('has-error');
            this.$('#email-help').html('Please enter an email address.');
            this.emailHasErrors = true;
        } else if (!re.test(this.email)) {
            this.$('#email-group').addClass('has-error');
            this.$('#email-help').html('Please enter a valid email address.');
            this.emailHasErrors = true;
        } else {
            this.$('#email-group').removeClass('has-error');
            this.$('#email-help').html('');
            this.emailHasErrors = false;
        }
    },

    validatePassword: function(e) {
        e.preventDefault();
        this.password = this.$inputPassword.val().trim();
        var errors = [];

        // Check password length
        if (this.password.length < 8 || this.password.length > 100) {
            errors.push('#pwd-length');
            this.$('#pwd-length').addClass('bg-danger');
        } else {
            this.$('#pwd-length').removeClass('bg-danger');
            this.$('#pwd-length').addClass('bg-success');
        }
        // Check for required symbol
        if (!this.password.match(/[\!\@\#\$\%\^\*]/g)) {
            errors.push('#pwd-symbol');
            this.$('#pwd-symbol').addClass('bg-danger');
        } else {
            this.$('#pwd-symbol').removeClass('bg-danger');
            this.$('#pwd-symbol').addClass('bg-success');
        }
        // Check for required number
        if (!this.password.match(/[0-9]/g)) {
            errors.push('#pwd-number');
            this.$('#pwd-number').addClass('bg-danger');
        } else {
            this.$('#pwd-number').removeClass('bg-danger');
            this.$('#pwd-number').addClass('bg-success');
        }
        // Check for lowercase letter
        if (!this.password.match(/[a-z]/g)) {
            errors.push('#pwd-lower');
            this.$('#pwd-lower').addClass('bg-danger');
        } else {
            this.$('#pwd-lower').removeClass('bg-danger');
            this.$('#pwd-lower').addClass('bg-success');
        }
        // Check for uppercase letter
        if (!this.password.match(/[A-Z]/g)) {
            errors.push('#pwd-upper');
            this.$('#pwd-upper').addClass('bg-danger');
        } else {
            this.$('#pwd-upper').removeClass('bg-danger');
            this.$('#pwd-upper').addClass('bg-success');
        }

        if (errors.length > 0) {
            this.$('#password-group').addClass('has-error');
            this.passwordHasErrors = true;
        } else {
            this.$('#password-group').removeClass('has-error');
            this.passwordHasErrors = false;
        }

        // Check that the passwords match.
        var repeatedPassword = this.$repeatPassword.val().trim();

        if (repeatedPassword !== this.password) {
            this.$('#repeat-password-group').addClass('has-error');
            this.$('#repeat-password-help').html('Passwords do not match.');
        } else {
            this.$('#repeat-password-group').removeClass('has-error');
            this.$('#repeat-password-help').html('');
        }
    },

    validateRepeatedPassword: function(e) {
        e.preventDefault();
        var password = this.$inputPassword.val().trim();
        var repeatedPassword = this.$repeatPassword.val().trim();

        if (repeatedPassword !== password) {
            this.$('#repeat-password-group').addClass('has-error');
            this.$('#repeat-password-help').html('Passwords do not match.');
            this.repeatPasswordHasErrors = true;
        } else {
            this.$('#repeat-password-group').removeClass('has-error');
            this.$('#repeat-password-help').html('');
            this.repeatPasswordHasErrors = false;
        }
    },

    createUser: function(e) {
        e.preventDefault();
        console.log('createUser!');
        // validate all required fields (again)
        this.validateName(e);
        this.validateEmail(e);
        this.validatePassword(e);
        this.validateRepeatedPassword(e);

        // Get the birthday, if entered.
        var birthday = this.$('#birthday').val();
        console.log(birthday);

        var employer = this.$('#inputEmployer').val().trim();
        var jobTitle = this.$('#inputJobTitle').val().trim();
        var name = this.username;
        var email = this.email;

        if (!this.repeatPasswordHasErrors && !this.passwordHasErrors && !this.emailHasErrors && !this.nameHasErrors) {
            // console.log('all fields valid.');

            // Create the user in Firebase using just the email and password.            
            var self = this;

            this.firebaseRef.createUser({
                email: this.email,
                password: this.password
            }, function(error, userData){
                if (error) {
                    console.log('Error creating user:', error);
                } else {
                    console.log('Successfully created user account with uid:', userData.uid);
                    // Now that we have the uid for the user, populate the users table with it.
                    var usersRef = self.firebaseRef.child('users');
                    var userAccountRef = usersRef.child(userData.uid);
                    userAccountRef.set({
                        name: name,
                        email: email,
                        birthday: birthday,
                        employer: employer,
                        jobTitle: jobTitle
                        }, function(error2) {
                            if (error2) {
                                console.log('Could not save data ' + error2);
                            } else {
                                console.log('Successfully saved.');
                                self.redirect();
                            }
                        }
                    );
                }
            });
        }
    },

    // Redirect to the event list page.
    redirect: function() {
      Backbone.history.navigate('#events', {trigger: true});
    }
  });

  return CreateAccountView;
});

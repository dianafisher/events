/*global require*/
'use strict';

require.config({  
  paths: {
    jquery: '../bower_components/jquery/dist/jquery',    
    underscore: '../bower_components/underscore/underscore',
    backbone: '../bower_components/backbone/backbone',
    bootstrap: '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap',
    firebase: '../bower_components/firebase/firebase',
    backbonefire: '../bower_components/backbonefire/dist/backbonefire'  
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    jquery: {
      exports: '$'
    },
    underscore: {
      deps:['jquery'],
      exports: '_'
    },
    backbone: {
      deps:['underscore', 'jquery'],
      exports: 'Backbone'
    },
    firebase: {
      exports: 'Firebase'
    },
    backbonefire: {
      deps:['backbone', 'firebase'],
      exports: 'BackboneFire'
    },
    waitSeconds: 15
  }
});

require([
  'backbone',  
  'routes/router'  
], function (Backbone, Router) {
  new Router();  
  Backbone.history.start();  
});

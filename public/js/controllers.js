'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
  }).
  controller('MyCtrl1', function ($scope, socket) {

    socket.on('frequency:locations', function (data) {
      $scope.frequency = data;

      var entries = [];
      angular.forEach(data, function(value, key) {
        entries.push([key, value]);
      });

      $scope.frequencyData = [{
        key: "Mention frequencies",
        values: entries
      }];

    });

    socket.on('tweets:latest', function (data) {
      $scope.latestTweets = data;
    });

    $scope.exampleData = [
        {
            key: "Cumulative Return",
            values: [
                ["A", -29.765957771107 ],
                ["B" , 0 ],
                ["C" , 32.807804682612 ],
                ["D" , 196.45946739256 ],
                ["E" , 0.19434030906893 ],
                ["F" , -98.079782601442 ],
                ["G" , -13.925743130903 ],
                ["H" , -5.1387322875705 ]
            ]
        }
    ];

  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });

var app = angular.module('customers', ['ngRoute', 'ngResource', 'ngMessages', 'templates']);

app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/", {
    controller: "CustomerSearchController",
    templateUrl: "customer_search.html"
  }).when("/:id", {
    controller: "CustomerDetailController",
    templateUrl: "customer_detail.html"
  });
}]);

app.controller('CustomerSearchController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  var page = 0;
  $scope.customers = [];

  $scope.search = function(searchTerm) {
    if (searchTerm < 3) {
      return;
    }
    $http.get("/customers.json",
              {"params": {"keywords": searchTerm, "page": page}})
    .then(function(response) {
      $scope.customers = response.data;
    }, function(response) {
      alert("There was a problem: " + response.status);
    });
  };

  $scope.previousPage = function() {
    if (page > 0) {
      page = page - 1;
      $scope.search($scope.keywords);
    }
  };

  $scope.nextPage = function() {
    page = page + 1;
    $scope.search($scope.keywords);
  };

  $scope.viewDetails = function(customer) {
    $location.path("/" + customer.id);
  };
}]);

app.controller("CustomerDetailController", ["$scope", "$http", "$routeParams",
"$resource", function($scope, $http, $routeParams, $resource) {
  $scope.customerId = $routeParams.id;
  var Customer = $resource("/customers/:customerId.json",
                            {"customerId": "@customer_id"},
                            {"save": {"method": "PUT"}});

  $scope.customer = Customer.get({ "customerId": $scope.customerId });

  $scope.save = function() {
    if ($scope.form.$valid) {
      $scope.customer.$save(function() {
        $scope.form.$setPristine();
        $scope.form.$setUntouched();
        alert("Save Successful!");
      }, function() {
        alert("Save Failed :(");
      });
    }
  };
}]);

app.controller("CustomerCreditCardController", ["$scope", "$resource", function($scope, $resource) {
  var CreditCardInfo = $resource('/fake_billing.json');
  $scope.setCardholderId = function(cardholderId) {
    $scope.creditCard = CreditCardInfo.get({ "cardholder_id": cardholderId });
  };
}]);

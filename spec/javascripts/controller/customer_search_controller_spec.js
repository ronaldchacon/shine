describe("CustomerSearchController", function() {
  describe("Initialization", function() {
    var scope = null;
    var controller = null;

    beforeEach(module("customers"));

    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller("CustomerSearchController", {
        $scope: scope
      });
    }));

    it("defaults to an empty customer list", function() {
      expect(scope.customers).toEqualData([]);
    });
  });

  describe("Fetching search results", function() {
    var scope = null;
    var controller = null;
    var httpBackend = null;
    var serverResults = [
      {
        id: 123,
        first_name: "Bob",
        last_name: "Jones",
        email: "bjones@foo.net",
        username: "jonesy"
      },
      {
        id: 456,
        first_name: "Bob",
        last_name: "Johnsons",
        email: "johnboy@bar.info",
        username: "bobbyj"
      }
    ];

    beforeEach(module("customers"));

    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      controller = $controller("CustomerSearchController", {
        $scope: scope
      });
    }));

    beforeEach(function() {
      httpBackend.when('GET', '/customers.json?keywords=bob&page=0')
      .respond(serverResults);
    });

    it("populates the customer list with the results", function() {
      scope.search("bob");
      httpBackend.flush();
      expect(scope.customers).toEqualData(serverResults);
    });
  });

  describe("Error handling", function() {
    var scope = null;
    var controller = null;
    var httpBackend = null;
    var serverResults = [
      {
        id: 123,
        first_name: "Bob",
        last_name: "Jones",
        email: "bjones@foo.net",
        username: "jonesy"
      },
      {
        id: 456,
        first_name: "Bob",
        last_name: "Johnsons",
        email: "johnboy@bar.info",
        username: "bobbyj"
      }
    ];

    beforeEach(module("customers"));

    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      controller = $controller("CustomerSearchController", {
        $scope: scope
      });
    }));

    beforeEach(function() {
      httpBackend.when("GET", "/customers.json?keywords=bob&page=0")
        .respond(500, "Internal server error");
      spyOn(window, "alert");
    });

    it("alerts the user on an error", function() {
      scope.search("bob");
      httpBackend.flush();
      expect(scope.customers).toEqualData([]);
      expect(window.alert).toHaveBeenCalledWith(
        "There was a problem: 500"
      );
    });
  });
});

describe("CustomerDetailController", function() {
  describe("Initialization", function() {
    var scope = null;
    var controller = null;
    var id = 42;
    var httpBackend = null;
    var customer = {
      id: id,
      first_name: "Bob",
      last_name: "Jones",
      username: "bob.jones",
      email: "bobbyj@somewhere.net",
      created_at: "2014-01-03T11:12:34"
    };
    beforeEach(module("customers"));
    beforeEach(inject(function($controller, $rootScope, $routeParams, $httpBackend) {
      scope = $rootScope.$new();
      httpBackend = $httpBackend;

      $routeParams.id = id;
      httpBackend.when('GET', '/customers/' + id + '.json')
        .respond(customer);
      controller = $controller("CustomerDetailController", {
        $scope: scope
      });
    }));
    it("fetches the customer from the backend", function() {
      httpBackend.flush();
      expect(scope.customer).toEqualData(customer);
    });
  });
});

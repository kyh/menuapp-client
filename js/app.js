angular.module('mobileCloneDemo', ['mobileClone', 'firebase', 'ngAnimate', 'snap'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when("/categories", {
                templateUrl: "/partials/categories.html",
                controller: 'DemoCtrl'
            })
            .when("/items", {
                templateUrl: "/partials/items.html",
                controller: 'DemoCtrl'
            })
            .otherwise({
                redirectTo: "/categories"
            });
    })
    .controller('DemoCtrl', function ($scope, $pages, $rootScope, $firebase, $location) {
        var menu = new Firebase('https://menuapp.firebaseio.com/MenuItems');
        var categories = new Firebase('https://menuapp.firebaseio.com/Category');
        menu.on('value', function(dataSnapshot) {
            $scope.menuItems = dataSnapshot.val();
          });
        $scope.menuItemArray = (function() {
            var itemArray = [];
            for(var item in $scope.menuItems) {
                itemArray.push($scope.menuItems[item]);
            }
            return itemArray;
        })();

        $scope.categories = $firebase(categories);
        
        $scope.chooseCategory = function(categ) {
            $rootScope.categoryChoice = categ.name;
            $pages.next('items');
        };

        $scope.addToPlate = function(item){
            $rootScope.$broadcast('addToPlate', item);
        };
    })
    .controller('OrderCtrl', function ($scope, $firebase, $rootScope, $animate){
        var orders = new Firebase('https://menuapp.firebaseio.com/Orders');
        $scope.orders = $firebase(orders);

        $rootScope.myPlate = [];
        $scope.orderPlaced = false;
        $scope.myTotal = 0;

        $scope.$on('addToPlate', function(name, item){
            $rootScope.myPlate.push(angular.copy(item));
            $scope.myTotal += item.price;
            $animate.addClass(angular.element(document.querySelector( '#notification' )), 'animate', function(){
                $animate.removeClass(angular.element(document.querySelector( '#notification' )), 'animate');
            });
        });
        $scope.removeFromPlate = function(obj, arr){
            $scope.myTotal -= obj.price;
            arr.splice(arr.indexOf(obj), 1);
        };
        $scope.canOrder = function(){
            if (!$rootScope.myPlate.length || !$scope.tableNum)
                return true;
        };
        $scope.order = function(){
            var myOrder = {
                'table': $scope.tableNum,
                'order': $rootScope.myPlate,
                'total': $scope.myTotal,
                'confirmed': false
            };
            $scope.orders.$add(angular.fromJson(angular.toJson(myOrder))).then(function(ref) {
                var myPlacedOrder = new Firebase('https://menuapp.firebaseio.com/Orders/'+ref.name());
                $scope.myPlacedOrder = $firebase(myPlacedOrder);
            });
            $rootScope.myPlate.length = 0;
            $scope.myTotal = 0;
            $scope.orderPlaced = true;
        };

    });

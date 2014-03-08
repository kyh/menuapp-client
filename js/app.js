angular.module('mobileCloneDemo', ['mobileClone', 'firebase', 'ngAnimate'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when("/categories", {
                templateUrl: "/MenuApp_V2_MAMP/partials/categories.html",
                controller: 'DemoCtrl'
            })
            .when("/items", {
                templateUrl: "/MenuApp_V2_MAMP/partials/items.html",
                controller: 'DemoCtrl'
            })
            .otherwise({
                redirectTo: "/categories"
            });
    })
    .run(function ($rootScope) {
        $rootScope.showMenu = false;
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

        $scope.showMenu = function(){
            $rootScope.showMenu = !$rootScope.showMenu;
            console.log($rootScope.showMenu);
        };
    })

    .controller('OrderCtrl', function ($scope, $firebase, $rootScope, $animate){
        var orders = new Firebase('https://menuapp.firebaseio.com/Orders');

        $rootScope.myPlate = [];
        $scope.orderPlaced = false;
        $scope.myTotal = 0;

        $scope.$on('addToPlate', function(name, item){
            $rootScope.myPlate.push(item);
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
        }
        $scope.order = function(){
            var myOrder = {
                'table': $scope.tableNum,
                'order': $rootScope.myPlate,
                'total': $scope.myTotal
            }
            orders.push(angular.fromJson(angular.toJson(myOrder)));
            $rootScope.myPlate.length = 0;
            $scope.myTotal = 0;
            $scope.orderPlaced = true;
        };

    })

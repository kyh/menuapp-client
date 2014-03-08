angular.module('mobileClone')
    .directive('mcView', function factory($pages, $rootScope, $q, $compile, $templateCache, $location) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '<ng-view id="ng-view" class="slide-animation ' + ((isMobile) ? 'native ios7' : 'ios7') + '"></ng-view>',
            controller: function ($scope, $element) {
                $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
                    function getPage(route) {
                        var url = route && route.$$route && route.$$route.originalPath;
                        return (url) ? url.split('/')[1] : null;
                    }

                    $scope.current = getPage(currRoute);
                    if (!$scope.current) {
                        return;
                    }
                    $scope.previous = getPage(prevRoute);

                    if (currRoute.pathParams) {
                        angular.extend($scope, currRoute.pathParams);
                    }
                    var isBack = null;
                    if (currRoute.params) {
                        isBack = currRoute.params.back;
                    }
                    $rootScope.$emit('pageChangeStart', $scope);
                    $pages.route($scope.previous, $scope.current, isBack);
                });
            },
            link: function (scope, element, attrs) {
            }
        };
    });

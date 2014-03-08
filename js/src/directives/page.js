angular.module('mobileClone')
    .directive('mcPage', function factory($pages, $transitions) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                id: '@',
                title: '@'
            },
            template: '<section ng-transclude></section>',
            controller: function ($scope, $element) {
                var buttons = $scope.buttons = [];
                this.addButton = function (button) {
                    buttons.push(button);
                }
            },
            link: function (scope, element, attrs) {
                element.find('header').append('<h1>' + scope.title + '</h1>');
                $transitions.resize(element.find('h1')[0]);
            }
        };
    })
    .directive('mcNav', function factory($pages) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^mcPage',
            scope: {
                position: '@',
                changeTo: '@',
                back: '=',
                action: '='
            },
            template: '<button ng-click="clicked()"><div class="label" ng-transclude></div></button>',
            controller: function ($scope, $element) {
                $scope.clicked = function () {
                    if ($scope.changeTo) {
                        if ($scope.back) {
                            $pages.back($scope.changeTo, null);
                        } else {
                            $pages.next($scope.changeTo, null);
                        }
                    } else {
                    }
                }
            },
            link: function (scope, element, attrs, pageCtrl) {
                var classes = [scope.position + '-nav' || 'left-nav'];
                if (scope.back === true) {
                    classes.push('arrow');
                }
                if (scope.action === true) {
                    classes.push('bold');
                }
                element.addClass(classes.join(' '));
                pageCtrl.addButton(scope);
            }
        };
    })
    .directive('mcContent', function factory() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^mcPage',
            template: '<div class="scrollWrap"><div class="scroll"><div class="content"><div class="strap" ng-transclude></div></div></div></div>',
            link: function (scope, element, attrs) {
                var html = '<div class="scrollMask"></div>';
                element.parent().find('header').after(html);
            }
        };
    })
    .directive('backImg', function(){
        return function(scope, element, attrs){
            attrs.$observe('backImg', function(value) {
                element.css({
                    'background-image': 'url(' + value +')',
                    'background-size' : 'cover'
                });
            });
        };
    });

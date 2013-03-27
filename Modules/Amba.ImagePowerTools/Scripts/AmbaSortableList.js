angular.module('AmbaSortableList', []).directive('ambaSortableList', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, attr, ngModel) {

            $scope.dragStart = function (e, ui) {
                ui.item.data('start', ui.item.index());
            };

            $scope.dragEnd = function (e, ui) {
                var start = ui.item.data('start'),
                    end = ui.item.index();
                var list = ngModel.$viewValue;

                list.splice(end, 0,
                    list.splice(start, 1)[0]);
                ngModel.$setViewValue(list);
                $scope.$apply();
            };

            var sortableParams = {
                start: $scope.dragStart,
                update: $scope.dragEnd
            };

            var additionalParams = $scope.$eval(attr["ambaSortableList"]);
            if (additionalParams) {
                sortableParams = $.extend(sortableParams, additionalParams);
            }

            element.sortable(sortableParams);
        }
    };
});
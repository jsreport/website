(function() {

    var module = angular.module('CustomFieldsConfiguration', ['ui']);

    var controllers = {};
    controllers.CustomFieldsConfigurationCtrl = function($scope, customFields, options) {
        var self = this;
        $scope.customFields = customFields;

        $scope.addField = function(formName) {
            var form = $scope[formName];
            if (!form.$valid)
                return;

            $scope.customFields.push({
                name: $.trim($scope.fieldName),
                displayName: $.trim($scope.fieldDisplayName),
                type: $scope.fieldType
            });
            $scope.resetForm(formName, { 'fieldName': '', 'fieldDisplayName': '', fieldType: 'text' });
        };

        $scope.resetForm = function(formName, defaults) {
            var form = $scope[formName];
            form.$setPristine();
            if (defaults) {
                for (var d in defaults) {
                    $scope[d] = defaults[d];
                }
            }                
        };

        $scope.nameIsUniq = function (fieldName) {
            fieldName = $.trim(fieldName);
            var position = getFieldPosition(fieldName);
            if (position >= 0)
                return false;
            return true;
        };

        $scope.nameIsNotFile = function(fieldName) {
            if (fieldName == "file") {
                return false;
            }
            return true;
        };

        $scope.nameIsNotEmpty = function(fieldName) {
            return $.trim(fieldName).length > 0;
        };

        function getFieldPosition(fieldName) {
            for (var i = 0; i < $scope.customFields.length; i++) {
                if ($scope.customFields[i].name == fieldName) {
                    return i;
                }
            }
            return -1;
        };

        $scope.removeField = function(fieldName) {
            var position = getFieldPosition(fieldName);
            if (position >= 0) {
                $scope.customFields.splice(position, 1);
            }
        };

        $scope.notDuplicate = function(value) {
            var position = getFieldPosition(value);
            return position < 0;
        };

    };
    module.controller(controllers);

})();




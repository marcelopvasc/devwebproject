require('./bootstrap');
import 'angular';

var app = angular.module('LaravelCRUD', []
    , ['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.post['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content');
    }]);

app.controller('TaskController', ['$scope', '$http', function ($scope, $http) {

}]);

$scope.tasks = [];

    // List tasks
    $scope.loadTasks = function () {
        $http.get('/task')
            .then(function success(e) {
                $scope.tasks = e.data.tasks;
            });
    };
    $scope.loadTasks();

    $scope.errors = [];

    $scope.task = {
        name: '',
        description: ''
    };
    $scope.initTask = function () {
        $scope.resetForm();
        $("#add_new_task").modal('show');
    };

    // Add new Task
    $scope.addTask = function () {
        $http.post('/task', {
            name: $scope.task.name,
            description: $scope.task.description
        }).then(function success(e) {
            $scope.resetForm();
            $scope.tasks.push(e.data.task);
            $("#add_new_task").modal('hide');

        }, function error(error) {
            $scope.recordErrors(error);
        });
    };

    $scope.recordErrors = function (error) {
        $scope.errors = [];
        if (error.data.errors.name) {
            $scope.errors.push(error.data.errors.name[0]);
        }

        if (error.data.errors.description) {
            $scope.errors.push(error.data.errors.description[0]);
        }
    };

    $scope.resetForm = function () {
        $scope.task.name = '';
        $scope.task.description = '';
        $scope.errors = [];
    };    

    $scope.edit_task = {};
    // initialize update action
    $scope.initEdit = function (index) {
        $scope.errors = [];
        $scope.edit_task = $scope.tasks[index];
        $("#edit_task").modal('show');
    };

    // update the given task
    $scope.updateTask = function () {
        $http.patch('/task/' + $scope.edit_task.id, {
            name: $scope.edit_task.name,
            description: $scope.edit_task.description
        }).then(function success(e) {
            $scope.errors = [];
            $("#edit_task").modal('hide');
        }, function error(error) {
            $scope.recordErrors(error);
        });
    };
 
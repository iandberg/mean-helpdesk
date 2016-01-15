var app = angular.module('app',['ui.router','ngAnimate','ngMessages']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: "/partials/tickets.html",
            controller: 'appCtrl'
        })
        .state('new_ticket',{
            url: '/tickets/new',
            templateUrl: "/partials/ticket_edit.html",
            controller: 'editTicket'
        })
        .state('single_ticket',{
            url: '/tickets/:id',
            templateUrl: "/partials/ticket_single.html",
            controller: 'showTicket'
        })
        .state('edit_ticket',{
            url: '/tickets/:id/edit',
            templateUrl: "/partials/tickets_edit.html",
            controller: 'editTicket'
        })
        .state('users',{
            url: '/users',
            templateUrl: "/partials/users.html",
            controller: 'allUsers'
        })
        .state('new_user',{
            url: '/users/new',
            templateUrl: "/partials/user_edit.html",
            controller: 'editUser'
        })
});

// =-=-=-=-=-=-=-[ filters ]=-=-=-=-=-=-=-

app.filter('truncateDesc', function () {
    return function (desc) {
        if(desc){
            desc = desc.substring(0, 100);
            desc += '...';
            return desc;
        }else{
            return '';
        }
    }
});

app.filter('formatDate', function () {
    return function (date) {
        return moment(date).calendar();
    }
});

app.filter('regex', function () {
    return function (data, field, regex) {

        if(field && regex){
            result = [];
            var expression = new RegExp(regex);
        
            for(var i=0; i < data.length; i++){
                if(expression.test(data[i][field])){ //apply regex pattern to the field in question
                    result.push(data[i]); //if it passes muster, add to outgoing result
                }
            }
            return result;
        }else{
            return data;
        }
    }
});

// =-=-=-=-=-=-=-[ directives ]=-=-=-=-=-=-=-

app.directive('confPassword', function () { //custom directive for validating the confirmation password
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngmodel) {
            ngmodel.$validators.comparepass = function () { //we add a validator
                console.log(scope.user.password_conf, scope.user.password);
                return scope.user.password_conf === scope.user.password;
            }
        }
    };
});

// =-=-=-=-=-=-=-[ controllers ]=-=-=-=-=-=-=-

//home page
app.controller('appCtrl', ['$scope','$http', function ($scope, $http) {

    $scope.getTickets = function () {
        $http.get('/tickets').success(function (res) {
            $scope.tickets = res;
        });
    }
    
    $scope.getUnsolved = function () {
        $http.get('/tickets/unsolved').success(function (res) {
            $scope.tickets = res;
        });
    }    
    
    $scope.statusClass =function (status) {
        switch(true){
            case status == 'Unsolved':
                return 'warning'
            case status == 'Solved':
                return 'success'
            case status == 'Pending':
                return 'secondary'
            default:
                return '';
        }    
    };
    
    $scope.search_criteria = {};
    $scope.getTickets(); //initial page load
}]);




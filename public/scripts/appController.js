var app = angular.module('app',['ui.router','ngAnimate','ngMessages','flash']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: "/partials/tickets.html",
            controller: 'showTickets'
        })
        .state('login',{
            url: '/login',
            templateUrl: "/partials/login.html",
            controller: 'loginUser'
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
            templateUrl: "/partials/ticket_edit.html",
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
        .state('edit_user',{
            url: '/users/:id',
            templateUrl: "/partials/user_edit.html",
            controller: 'editUser'
        })
});

// =-=-=-=-=-=-=-[ filters ]=-=-=-=-=-=-=-

app.filter('truncateDesc', function () {
    return function (desc) {
        if(desc){
            if(desc.length > 99){
                desc = desc.substring(0, 100);
                desc += '...';
            }
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

// =-=-=-=-=-=-=-[ services ]=-=-=-=-=-=-=-

app.service('Session', function () {
    this.create = function (user) {
        this.userID = user._id;
        this.name = user.name.first;
    },
    this.destroy = function () {
        this.userID = null;
        this.name = null;
    }
});

// =-=-=-=-=-=-=-[ root controller ]=-=-=-=-=-=-=-

app.controller('appCtrl', ['$scope','$http', 'Session', '$location', function ($scope, $http, Session, $location) {

    $scope.userName = null; //initialize user name, until someone logs in
    // need to check node session for user, in case page is refreshed
    
    $scope.setSession = function (user) { //available in all controller scopes
        $scope.userName = user.name.first;
        $scope.userID = user._id;
    };
    
    $scope.logout = function () {
        Session.destroy();
        $scope.userName = null;
        $http.get('/user/end_session').then(function (res) {

        },function (err) {
            console.log(err);
        });
        
        $location.path('/'); //return to home page
    };

    $scope.checkUser = function () {
        $http.get('/user/log_status').then(function (res) {
            
            if(res.data.loggedIn){ //if session on express has user, then transfer to angular
                $scope.setSession({name: {first: res.data.userName}, _id: res.data.userID });
            }
            
        },function (err) {
            console.log(err);
        });
    };
    
    $scope.checkUser(); // check for user on express session, if page is reloaded

}]);




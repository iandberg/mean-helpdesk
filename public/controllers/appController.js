var app = angular.module('app',['ui.router','ngAnimate']);

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
            templateUrl: "/partials/tickets_new.html",
            controller: 'editTicket'
        })
        .state('single_ticket',{
            url: '/tickets/:id',
            templateUrl: "/partials/ticket_single.html",
            controller: 'showTicket'
        })
        .state('edit_ticket',{
            url: '/tickets/:id/edit',
            templateUrl: "/partials/tickets_new.html",
            controller: 'editTicket'
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
        return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    }
});

// =-=-=-=-=-=-=-[ controllers ]=-=-=-=-=-=-=-

//home page
app.controller('appCtrl', ['$scope','$http', function ($scope, $http) {
    var getTickets = function () {
        $http.get('/tickets').success(function (res) {
            $scope.tickets = res;
        });
    }
    
    getTickets();
}]);

// for create and update
app.controller('editTicket', ['$scope','$http','$state', '$stateParams', '$timeout', function ($scope, $http, $state, $stateParams, $timeout) {

    var state = $state.current.name; //get the state name
    $scope.state = state;
    $scope.editmode = false; //to dynamically show the correct submit button in the partial
    
    //we handle both creating and updating here, using same partial
    if(state == "new_ticket"){
    
        $scope.header = "Create a new Ticket";
        
        $scope.addTicket = function () {
            $http.post('/tickets', $scope.ticket).success(function (res) {
                console.log('ticket added');
            });
        };

    }else if(state == "edit_ticket"){
        
        $scope.header = "Update Ticket";
        $scope.editmode = true; //switch to true for the conditional in the partial
        
        $http.get('/tickets/'+ $stateParams.id).success(function (res) {
            $scope.ticket = res;
        });

        $scope.updateTicket = function () {
            $http.put('/tickets/'+$scope.ticket._id, $scope.ticket).success(function (res) {
                console.log('ticket updated');
                $scope.message_class = ['success','callout'];
                $scope.message = "Ticket updated";
            });

            $timeout(function () {// remove update message
                $scope.message_class = 'hide_message';
            },5000);
        };
       
    }

    
}]);

// show single ticket
app.controller('showTicket',['$scope','$http','$stateParams',function ($scope, $http, $stateParams) {

    $http.get('/tickets/'+ $stateParams.id).success(function (res) {
        $scope.ticket = res;
    });

}]);
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
        $scope.status_options = ['Pending','Unsolved','Solved']; //you can only set these options when editing
        
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
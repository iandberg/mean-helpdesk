// =-=-=-=-=-=-=-[ create/edit tickets ]=-=-=-=-=-=-=-

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
        
        $http.get('/tickets/' + $stateParams.id).success(function (res) {
            $scope.ticket = res;
        });

        $scope.updateTicket = function () {
            $http.put('/tickets/' + $scope.ticket._id, $scope.ticket).success(function (res) {
                console.log('ticket updated');
                $scope.message_class = ['success','callout'];
                $scope.message = "Ticket updated";
            });

            $timeout(function () { // remove update message
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

// =-=-=-=-=-=-=-[ create/edit tickets ]=-=-=-=-=-=-=-

// show all tickets
app.controller('showTickets', function ($scope, $http) {

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
    
    $scope.statusClass = function (status) {
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

});

// edit/create ticket
app.controller('editTicket', ['$scope','$http','$state', '$stateParams', '$timeout', '$location', 'Flash', function ($scope, $http, $state, $stateParams, $timeout, $location, Flash) {

    //we handle both creating and updating here, using same partial
    
    var state = $state.current.name; //get the state name
    $scope.state = state;
    $scope.editmode = false; //to dynamically show the correct submit button in the partial
    
    if(state == "new_ticket"){
    
        $scope.header = "Create a new Ticket";

        $scope.addTicket = function () {
            $http.post('/tickets', $scope.ticket).success(function (res) {
                console.log('ticket added');
                Flash.create('success', 'Ticket added');
                $location.path('/ticket/' + res._id);
            });
        };
        

    }else if(state == "edit_ticket"){
        
        $scope.editmode = true; //switch to true for the conditional in the partial
        $scope.header = "Update Ticket";
        $scope.status_options = ['Pending','Unsolved','Solved']; //you can only set these options when editing
        
        var getTicket = function (){
        	$http.get('/tickets/' + $stateParams.id).success(function (res) {
				if(res){
					$scope.ticket = res;
				}else{
					$location.path('/');
				}
			});
		};
		
		getTicket(); //initial ticket retrieval
		
		// =-=-=-=-=-=-=-[ update ticket ]=-=-=-=-=-=-=-
		
        $scope.updateTicket = function () {
            $http.put('/tickets/' + $scope.ticket._id, $scope.ticket).success(function (res) {
				getTicket();
				Flash.create('success', 'Ticket updated');
            });

            $timeout(function () { // remove update message
                $scope.message_class = 'hide_message';
            },5000);
        };
        
		// =-=-=-=-=-=-=-[ delete ticket ]=-=-=-=-=-=-=-
		
        $scope.deleteTicket = function (ticketID) {
        
        	if(confirm("Are you sure?")){
				$http.delete('/tickets/' + ticketID).then(function (res) {
					console.log('deleted ticket id ', ticketID);
					$location.path('/');
					Flash.create('warning', 'Ticket deleted');
				}, function (err) {
					console.log(err.data);
				});
			}
        }
       
    }

}]);

// show single ticket, and update certain features
app.controller('showTicket',['$scope','$http','$stateParams',function ($scope, $http, $stateParams) {

    var getSingleTicket = function(){
    	$http.get('/tickets/'+ $stateParams.id).success(function (res) {
			$scope.ticket = res;
		});
	};
	
	getSingleTicket(); //initial retrieval of ticket
	
    $scope.postComment = function (comment) {
    	$http.put('/ticket/' + $stateParams.id + '/comment', $scope.comment).then(function (res) {
    		$scope.comment = {}; //clear out form
			getSingleTicket(); //refresh listing
    	},function (error) {
    		console.log(error.data);
    	});
    }

}]);

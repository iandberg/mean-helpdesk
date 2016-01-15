// =-=-=-=-=-=-=-[ create/edit users ]=-=-=-=-=-=-=-

app.controller('editUser', function ($scope, $http, $state, $stateParams) {
	
	var state = $state.current.name;
	$scope.state = state;
	$scope.editmode = false;
	
	if(state == 'new_user'){
		$scope.header = "Create Account";
		$scope.myvalue = "supercali"; //testing
		
		$scope.addUser = function () {
			$http.post('/users', $scope.user).success(function (res) {
				console.log('created user');
			});
		};
		
	}else if(state == 'edit_user'){
		$scope.editmode = true; //for enabling correct submit button in partial
	}

});

app.controller('allUsers', function ($scope, $http) {
	$http.get('/users').success(function (res) {
		$scope.users = res;
	});
});
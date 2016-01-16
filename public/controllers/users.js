// =-=-=-=-=-=-=-[ create/edit users ]=-=-=-=-=-=-=-

app.controller('loginUser', function ($scope, $http, $state, $location, Session) {
	
	$scope.header = "Login";
	
	$scope.login = function () {
		$http.post('/login', $scope.user).then(
			function success(res) { //if we get something, check for error messages
				if(res.data.error){
					$scope.message = res.data.error;
				}else{ //succesful login
					Session.create(res.data); //user data to angular session var
					$scope.setUserName(res.data.name.first) //set site-wide username via appCtrl function
					$location.path('/'); //redirect to homepage
				}
			},function error(res) {
				console.log(res.data);
		});
	}
});

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
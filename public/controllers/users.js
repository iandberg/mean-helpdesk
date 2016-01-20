// =-=-=-=-=-=-=-[ create/edit users ]=-=-=-=-=-=-=-

app.controller('loginUser', function ($scope, $http, $state, $location, Session, Flash) {
	
	$scope.header = "Login";
	
	$scope.login = function () {
		$http.post('/login', $scope.user).then(
			function success(res) { //if we get something, check for error messages
				if(res.data.error){
					$scope.message = res.data.error;
				}else{ //succesful login
					Session.create(res.data); //user data to angular session var
					$scope.setSession(res.data) //set site-wide username via appCtrl function
					Flash.create('success', 'Logged In!');
					$location.path('/'); //redirect to homepage
				}
			},function error(res) {
				console.log(res.data);
		});
	}
});

app.controller('editUser', function ($scope, $http, $state, $stateParams, Flash, $location) {
	
	var state = $state.current.name;
	$scope.state = state;
	$scope.editmode = false;
	
	if(state == 'new_user'){
		$scope.header = "Create Account";
		
		$scope.addUser = function () {
			$http.post('/users', $scope.user).success(function (res) {
				Flash.create('success', 'Account created - please log in');
				$location.path('/login');
			});
		};
		
	}else if(state == 'edit_user' && $scope.userName){
		$scope.editmode = true; // for enabling correct submit button in partial
		$scope.header = "Edit Account";
		
		$http.get('/users/' + $stateParams.id).then(function (res) {
			res.data.password = ''; // hashed password not needed
			$scope.user = res.data;
		}, function (err) {
			console.log(err.data);
		});
		
		$scope.updateUser = function (user) {
			$http.put('/users/' + $scope.user._id, user).then(function (res) {
				Flash.create('success', 'Account Updated');
			}, function (err) {
				console.log(err);
			});
		};
	}else{
		$location.path('/');
	}

});

app.controller('allUsers', function ($scope, $http) {
	
	var getAllUsers = function () {	
		$http.get('/users').success(function (res) {
			$scope.users = res;
		});
	}
	
	getAllUsers();
	
	$scope.deleteUser = function (id) {
		if(confirm("Are you sure?")){
			$http.delete('/users/' + id).success(function (res) {
				console.log('user: ', id, 'deleted');
				getAllUsers(); //refresh listing
			});
		}
	}
});
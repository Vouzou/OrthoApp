var app = angular.module('orthoApp', ['ngRoute', 'ngResource']).run(function($http, $rootScope) {
    $rootScope.authenticated = false;
    $rootScope.current_user = "";
    $rootScope.selectedPatient = null;

	$rootScope.signout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
        $rootScope.current_user = "";
	};
});

app.config(function($routeProvider){
	$routeProvider
    //the timeline display
    .when('/', {
        templateUrl: 'main.html'
    })
    .when('/dashboard', {
        templateUrl: 'dashboard.html',
        controller: 'dashboardController'
    })
    //the login display
    .when('/login', {
        templateUrl: 'login.html',
        controller: 'authController'
    })
    //the signup display
    .when('/register', {
        templateUrl: 'register.html',
        controller: 'authController'
    })
    .when('/addPatient', {
        templateUrl: 'addPatient.html',
        controller: 'addPatientController'
    })
    .when('/patient/:name', {
        templateUrl: 'patientDetails.html',
        controller: 'patientDetailsController'
    })
    .when('/patients', {
        templateUrl: 'patientList.html',
        controller: 'patientListController'
    });
    updateNavBar();
});

function updateNavBar() {
    $(".nav a").on("click", function(){
       $(".nav").find(".active").removeClass("active");
       $(this).parent().addClass("active");
    });
    $(".header a").on("click", function(){
       $(".nav").find(".active").removeClass("active");
    });
};

function setNavbarToHome() {
    $("#home").addClass("active");
}

function setNavbarToPatients() {
    $(".nav").find(".active").removeClass("active");
    $("#patients").addClass("active");
}

app.factory('patientService', function($resource){
	return $resource('/api/patients/:id', null, {
        'update': { method: 'PUT' }
    });
});

app.controller('dashboardController', function($scope, $rootScope){
    $scope.date = new Date();
    $scope.appointments = [{ time: '17:00', patientFirstName: 'Charalampos', patientLastName: 'Karypidis'},
                           { time: '18.00', patientFirstName: 'Georgios', patientLastName: 'Vouzounaras'},
                           { time: '19.00', patientFirstName: 'Roula', patientLastName: 'Koromila'}
                          ];
});

app.controller('addPatientController', function($scope, $rootScope, $location, patientService){
    // We can attach the `fileselect` event to all file inputs on the page
    var $imageupload = $('.imageupload');
    $imageupload.imageupload();
    
    $scope.addPatient = function() {
		patientService.save($scope.newPatient);
        $scope.patients = patientService.query();
		$scope.newPatient = {firstName: '', lastName: '', parentName: ''};
        $location.path('/patients');
        setNavbarToPatients();
	};
});

app.controller('patientDetailsController', function($scope, $rootScope, patientService) {
    $scope.isEditable = false;
    $scope.editSaveButtonLabel = 'Edit';

    $scope.editPatient = function() {
        $scope.isEditable = !$scope.isEditable;
        if ($scope.editSaveButtonLabel == 'Edit') {
            $scope.editSaveButtonLabel = 'Save';
        }
        else {
            $scope.editSaveButtonLabel = 'Edit';
            //Update patient
            patientService.update({id: $rootScope.selectedPatient._id}, $rootScope.selectedPatient);
        }
    };
});

app.controller('patientListController', function($scope, $rootScope, patientService){
    $scope.patients = patientService.query();
    
    $scope.deletePatient = function(patient) {
        if (confirm('Are you sure you want to delete this patient?')) {
            patientService.remove({id: patient._id});
            $scope.patients = patientService.query();
        }        
    };

    $scope.updateSelectedPatient = function(patient) {
        $rootScope.selectedPatient = patient;
    };
});

app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/dashboard');
                setNavbarToHome();
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};

	$scope.register = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/dashboard');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};
});
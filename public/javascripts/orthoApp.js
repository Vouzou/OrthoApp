var app = angular.module('orthoApp', ['ngRoute', 'ngResource']).run(function($http, $rootScope) {
    $rootScope.authenticated = false;
    $rootScope.current_user = "";

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
    .when('/patientDetails', {
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

app.factory('patientService', function($resource){
	return $resource('/api/patients/:id');
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
	};
});

app.controller('patientDetailsController', function($scope){
    $scope.patient = {id: 15, firstName: 'Dimitris', lastName: 'Arampatzis', age: 30, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/p320x320/15181151_10154975148049767_8868253567206843055_n.jpg?oh=d42941992d065f142ce94db8b69a2e1b&oe=58EF5C99'
    };
});

app.controller('patientListController', function($scope, $rootScope, patientService){
    $scope.patients = patientService.query();
    
    $scope.deletePatient = function(id) {
        //patientService.delete(id);
        //$scope.patients = patientService.query();
    };
	/*$scope.patients = [{ id: 11, firstName: 'Charalampos', lastName: 'Karypidis', age: 30, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/p320x320/12494684_10208926246132834_1811881343325497310_n.jpg?oh=e99c286ee9330b112f59aa5e59ccadac&oe=58F3C6D0' },
                    { id: 12, firstName: 'Vassiliki', lastName: 'Sitaropoulou', age: 30, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/p320x320/15171150_10157749262140257_9212342606264495732_n.jpg?oh=ead8b0ab5f90adbcc8097f86a5497ce0&oe=58B95C67' },
                    { id: 13, firstName: 'Georgina', lastName: 'Christofidou', age: 30, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/t31.0-8/15370165_10211711713491064_5943333889406768786_o.jpg' },
                    { id: 14, firstName: 'Dimitris', lastName: 'Papaioannou', age: 36, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/c28.28.347.347/s320x320/320122_3818124665794_1198656553_n.jpg?oh=36c581f935e7ba03164c93bc00438ae1&oe=58F87921' },
                    { id: 15, firstName: 'Dimitris', lastName: 'Arampatzis', age: 30, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/p320x320/15181151_10154975148049767_8868253567206843055_n.jpg?oh=d42941992d065f142ce94db8b69a2e1b&oe=58EF5C99' },
                    { id: 16, firstName: 'Alexandros', lastName: 'Ntemiris', age: 29, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/p320x320/14212760_10210810801408825_20510518086718271_n.jpg?oh=7318263c04e77c859ff1f7f9bd464327&oe=58C54609' },
                    { id: 17, firstName: 'Kostas', lastName: 'Papadopoulos', age: 12, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/p320x320/14492380_10154771712495166_6237797562405784136_n.jpg?oh=c5dd16f5b7289ad8a820f7f4501f3131&oe=58BF911D' },
                    { id: 18, firstName: 'Maria', lastName: 'Pavlidou', age: 15, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/p320x320/14449763_10209232492303085_2948191937891685366_n.jpg?oh=d8cb46ad56231473f48f604159c74f2d&oe=58F59E2C' },
                    { id: 19, firstName: 'Giannis', lastName: 'Giannakis', age: 9, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/p320x320/12745923_10154114495604059_4365480743814883150_n.jpg?oh=ca87a5baa547557a7c67d65d21c245ae&oe=58F41CEB' },
                    { id: 20, firstName: 'Roula', lastName: 'Koromila', age: 17, imageUrl: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/p320x320/15037290_1506581746024524_3129931970237411773_n.jpg?oh=17f9dc9fb4a31e9913f11662f380b0e2&oe=58BA2018' }];*/
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
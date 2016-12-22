var app = angular.module('orthoApp', ['ngRoute', 'ngResource', 'ngCookies']).run(function($http, $rootScope, $cookies) {
    $rootScope.current_user = $cookies.get('username');
    $rootScope.current_user_id = $cookies.get('userId');
    $rootScope.dropboxToken = $cookies.get('dropboxToken');
    $rootScope.authenticated = false;
    if (typeof $rootScope.current_user != 'undefined' && $rootScope.current_user != null) {
        $rootScope.authenticated = true;
    }
    $rootScope.selectedPatient = $cookies.getObject('patient');

    var pathname = window.location.pathname;
    setNavbar(pathname);

    $rootScope.signout = function(){
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = null;
        $rootScope.dropboxToken = null;
        $cookies.remove('username');
        $cookies.remove('patient');
        $cookies.remove('dropboxToken');
        $cookies.remove('dropboxLabel');
        $cookies.remove('userId');
    };
})

app.config(function($routeProvider, $locationProvider){
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
    })
    .when('/dropbox', {
        templateUrl: 'dropbox.html',
        controller: 'dropboxController'
    });
    $locationProvider.html5Mode(true);
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

function setNavbar(pathname) {
    if (pathname.includes("add")) {
        $("#addPatient").addClass("active");
    }
    else if (pathname.includes("patient")) {
        $("#patients").addClass("active");
    }
    else if (pathname.includes("calendar")) {
        $("#calendar").addClass("active");
    }
    else if (pathname.includes("dropbox")) {
        $("#dropbox").addClass("active");
    }
    else {
        $("#home").addClass("active");
    }
}

function uploadProfilePic(patient, dropboxToken, callback) {
    var dbx = new Dropbox({ accessToken: dropboxToken });
    var fileInput = document.getElementById('file-upload');
    var file = fileInput.files[0];
    dbx.filesUpload({path: '/' + patient.first_name + ' ' + patient.last_name + '/' + file.name, contents: file, mode: {'.tag': 'overwrite'}})
        .then(function(response) {
            console.log(response);
            var xhr = new XMLHttpRequest();
            if (!xhr) {
              throw new Error('CORS not supported');
            }
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    var responseText = xhr.responseText;
                    console.log(responseText);
                    // process the response.
                    var obj = JSON.parse(responseText);
                    var previewStr = 'dl.dropboxusercontent.com';
                    var replaceStr = 'www.dropbox.com';
                    patient.image_url = obj.url.replace(replaceStr, previewStr);
                    if (typeof callback === "function") {
                        callback();
                    }
                }
            };

            xhr.onerror = function() {
                console.log('There was an error!');
            };
            var url = 'https://api.dropboxapi.com/1/shares/auto/' + file.name + '?short_url=false';
            console.log('url: ' + url);
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Authorization", "Bearer D09eGuemEpoAAAAAAAAUXU9zWmdZ3IMpJ_mBb0659H4UyGcAl_Qg5AGwWDZNU25J");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            console.log('xhr.send()');
            xhr.send();
        })
        .catch(function(error) {
            console.error(error);
        });
}

app.factory('userService', function($resource){
    return $resource('/api/users/:userId/patients', null, {
        'update': { method: 'PUT' }
    });
});

app.factory('patientService', function($resource){
    return $resource('/api/patients/:patientId', null, {
        'update': { method: 'PUT' }
    });
});

app.factory('dropboxService', function($resource){
    return $resource('/api/dropboxes/:userId', null, {
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

app.controller('addPatientController', function($scope, $rootScope, $location, userService){
    // We can attach the `fileselect` event to all file inputs on the page
    var $imageupload = $('.imageupload');
    $imageupload.imageupload();
    
    $scope.savePatient = function() {
        $scope.newPatient.image_url = obj.url.replace(replaceStr, previewStr);
        userService.save({userId: $rootScope.current_user_id}, $scope.newPatient);
        $scope.patients = userService.get({userId: $rootScope.current_user_id});
        $scope.newPatient = {firstName: '', lastName: '', parentName: ''};
        $location.path('/patients');
        setNavbarToPatients();
    }
    
    $scope.addPatient = function() {
     //uploadProfilePic($scope.newPatient, $rootScope.dropboxToken, $scope.savePatient);
        if ($scope.new_image_url != null) {
            $rootScope.newPatient.image_url = $scope.image_url;
            userService.save({userId: $rootScope.current_user_id}, $scope.newPatient);
            //update cookies
            //$cookies.putObject('patient',$rootScope.newPatient);
            $scope.patients = userService.get({userId: $rootScope.current_user_id});
            $scope.newPatient = {firstName: '', lastName: '', parentName: ''};
            $location.path('/patients');
            setNavbarToPatients();
        }
        else if (typeof file != 'undefined' && file != null) {
            var dbx = new Dropbox({ accessToken: $rootScope.dropboxToken });
            var fileInput = document.getElementById('file-upload');
            var file = fileInput.files[0];
            dbx.filesUpload({path: '/' + patient.first_name + ' ' + patient.last_name + '/' + file.name, contents: file, mode: {'.tag': 'overwrite'}})
                .then(function(response) {
                  console.log(response);
                    var xhr = new XMLHttpRequest();
                    if (!xhr) {
                      throw new Error('CORS not supported');
                    }
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == XMLHttpRequest.DONE) {
                            var responseText = xhr.responseText;
                            console.log(responseText);
                            // process the response.
                            var obj = JSON.parse(responseText);
                            var previewStr = 'dl.dropboxusercontent.com';
                            var replaceStr = 'www.dropbox.com';
                            $scope.newPatient.image_url = obj.url.replace(replaceStr, previewStr);
                            userService.save({userId: $rootScope.current_user_id}, $scope.newPatient);
                            $scope.patients = userService.get({userId: $rootScope.current_user_id});
                            $scope.newPatient = {firstName: '', lastName: '', parentName: ''};
                            $location.path('/patients');
                            setNavbarToPatients();
                        }
                    };
                    xhr.onerror = function() {
                        console.log('There was an error!');
                    };
                    var url = 'https://api.dropboxapi.com/1/shares/auto/' + file.name + '?short_url=false';
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Authorization", "Bearer D09eGuemEpoAAAAAAAAUXU9zWmdZ3IMpJ_mBb0659H4UyGcAl_Qg5AGwWDZNU25J");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.send();
                })
                .catch(function(error) {
                  console.error(error);
                });
        }
        else {
            userService.save({userId: $rootScope.current_user_id}, $scope.newPatient);
            //update cookies
            //$cookies.putObject('patient',$rootScope.newPatient);
            $scope.patients = userService.get({userId: $rootScope.current_user_id});
            $scope.newPatient = {firstName: '', lastName: '', parentName: ''};
            $location.path('/patients');
            setNavbarToPatients();
        }
    };
});

app.controller('patientDetailsController', function($scope, $rootScope, patientService, $cookies, $window) {
    // We can attach the `fileselect` event to all file inputs on the page
    var $imageupload = $('.imageupload');
    $imageupload.imageupload();
    $scope.isEditable = false;
    $scope.editSaveButtonLabel = 'Edit';
    
    $scope.updatePatient = function() {
        patientService.update({id: $rootScope.selectedPatient._id}, $rootScope.selectedPatient);
        //update cookies
        $cookies.putObject('patient',$rootScope.selectedPatient);
    }

    $scope.editPatient = function() {
        $scope.isEditable = !$scope.isEditable;
        if ($scope.editSaveButtonLabel == 'Edit') {
            $scope.editSaveButtonLabel = 'Save';
            $window.scrollTo(0, 0);
        }
        else {
            $scope.editSaveButtonLabel = 'Edit';
            var fileInput = document.getElementById('file-upload');
            var file = fileInput.files[0];
            //Update patient
            if ($scope.new_image_url != null) {
                $rootScope.selectedPatient.image_url = $scope.new_image_url;
                patientService.update({id: $rootScope.selectedPatient._id}, $rootScope.selectedPatient);
                //update cookies
                $cookies.putObject('patient',$rootScope.selectedPatient);
            }
            else if (typeof file != 'undefined' && file != null) {
                //uploadProfilePic($rootScope.selectedPatient, $scope.updatePatient);
                console.log('root token: ' + $rootScope.dropboxToken);
                var dbx = new Dropbox({ accessToken: $rootScope.dropboxToken });
                dbx.filesUpload({path: '/' + patient.first_name + ' ' + patient.last_name + '/' + file.name, contents: file, mode: {'.tag': 'overwrite'}})
                    .then(function(response) {
                      console.log(response);
                        var xhr = new XMLHttpRequest();
                        if (!xhr) {
                          throw new Error('CORS not supported');
                        }
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState == XMLHttpRequest.DONE) {
                                var responseText = xhr.responseText;
                                console.log(responseText);
                                // process the response.
                                var obj = JSON.parse(responseText);
                                var previewStr = 'dl.dropboxusercontent.com';
                                var replaceStr = 'www.dropbox.com';
                                $rootScope.selectedPatient.image_url = obj.url.replace(replaceStr, previewStr);
                                patientService.update({id: $rootScope.selectedPatient._id}, $rootScope.selectedPatient);
                                //update cookies
                                $cookies.putObject('patient',$rootScope.selectedPatient);
                            }
                        };
                        xhr.onerror = function() {
                            console.log('There was an error!');
                        };
                        var url = 'https://api.dropboxapi.com/1/shares/auto/' + file.name + '?short_url=false';
                        xhr.open("POST", url, true);
                        xhr.setRequestHeader("Authorization", "Bearer D09eGuemEpoAAAAAAAAUXU9zWmdZ3IMpJ_mBb0659H4UyGcAl_Qg5AGwWDZNU25J");
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        xhr.send();
                    })
                    .catch(function(error) {
                      console.error(error);
                    });
            }
            else {
                patientService.update({id: $rootScope.selectedPatient._id}, $rootScope.selectedPatient);
                //update cookies
                $cookies.putObject('patient',$rootScope.selectedPatient);
            }
        }
    };
});

app.controller('patientListController', function($scope, $rootScope, userService, patientService, $cookies){
    $scope.patients = userService.get({userId: $rootScope.current_user_id});
    
    $scope.deletePatient = function(patient) {
        if (confirm('Are you sure you want to delete this patient?')) {
            patientService.remove({id: patient._id});
            $scope.patients = userService.get({userId: $rootScope.current_user_id});
        }        
    };

    $scope.updateSelectedPatient = function(patient) {
        $rootScope.selectedPatient = patient;
        $cookies.putObject('patient',patient);
    };
});

app.controller('dropboxController', function($scope, $rootScope, $cookies, $window, dropboxService){
    var dropboxLabel = $cookies.get('dropboxLabel');
    if (typeof dropboxLabel == 'undefined' || dropboxLabel == null || dropboxLabel == "") {
        dropboxLabel = 'Connect Dropbox';
    }
    if (dropboxLabel == 'Dropbox Connected') {
        $("#dropboxButton").removeClass("btn-primary");
        $("#dropboxButton").addClass("btn-success");
    }
    $scope.dropboxLabel = dropboxLabel;
    var pathname = window.location.search;
    if (pathname != '' && (typeof $rootScope.dropboxToken == 'undefined' || $rootScope.dropboxToken == null
       || $rootScope.dropboxToken != '')) {
        var responseList = pathname.split('&');
        var codeArr = responseList[0].split('=');
        //create dropbox api request with the code
        var code = codeArr[1];
        var url = 'https://api.dropbox.com/1/oauth2/token?code=' + code + 
            '&grant_type=authorization_code&client_id=tt6w0lmgryj0dzc&redirect_uri=http://localhost:3000/dropbox' +
            '&client_secret=9ctz1v0dd3y38mi';
        var xhr = new XMLHttpRequest();
        if (!xhr) {
          throw new Error('CORS not supported');
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                
                
                $scope.dropboxLabel = 'Dropbox Connected';
                var responseText = xhr.responseText;
                console.log(responseText);
                // process the response.
                var obj = JSON.parse(responseText);
                $cookies.put('dropboxToken', obj.access_token);
                //Get user by user id and save the token to the database
                dropboxService.save({user_id: $rootScope.current_user_id, dropboxToken: obj.access_token});
                //dropboxService.update({id: $rootScope.current_user_id}, obj.access_token);
                $("#dropboxButton").removeClass("btn-primary");
                $("#dropboxButton").addClass("btn-success");
                $cookies.put('dropboxLabel', 'Dropbox Connected');
                $rootScope.dropboxToken = obj.access_token;
            }
        };

        xhr.onerror = function() {
            console.log('There was an error!');
            $("#dropboxButton").removeClass("btn-primary");
            $("#dropboxButton").addClass("btn-warning");
            $scope.dropboxLabel = 'Dropbox Not Connected';
            $cookies.put('dropboxLabel', 'Dropbox Not Connected');
        };
        xhr.open("POST", url, true);
        xhr.send();
    }
    
    $scope.connectDropbox = function() {
        var url = 'https://www.dropbox.com/1/oauth2/authorize?client_id=tt6w0lmgryj0dzc&response_type=code&redirect_uri=http://localhost:3000/dropbox';
        $window.location.href = url;
    };
    
    $scope.uploadFile = function() {
        var dbx = new Dropbox({ accessToken: $rootScope.dropboxToken });
          var fileInput = document.getElementById('file-upload');
          var file = fileInput.files[0];
          dbx.filesUpload({path: '/' + file.name, contents: file})
            .then(function(response) {
              console.log(response);
            })
            .catch(function(error) {
              console.error(error);
            });
    };
});

app.controller('authController', function($scope, $http, $rootScope, $location, $cookies, dropboxService){
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';
    
    $scope.login = function(){
        $http.post('/auth/login', $scope.user).success(function(data){
            if(data.state == 'success'){
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $rootScope.current_user_id = data.user._id;
                //get dropbox token for the user
                var response = dropboxService.get({userId: data.user._id}, function() {
                    console.log('token: ' + response.token);
                    $rootScope.dropboxToken = response.token;
                    $location.path('/dashboard');
                    $cookies.put('dropboxToken', response.token);
                    setNavbarToHome();
                })
                $cookies.put('username', data.user.username);
                $cookies.put('userId', data.user._id);
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
                $rootScope.current_user_id = data.user._id;
                $cookies.put('username', data.user.username);
                $cookies.put('userId', data.user._id);
                $location.path('/dashboard');
            }
            else{
                $scope.error_message = data.message;
            }
        });
    };
});
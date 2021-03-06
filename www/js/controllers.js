var app = angular.module('starter.controllers', ['ionic', 'ui.router']);

app.controller('DashCtrl', function ($scope) {
});

app.controller('ChatsCtrl', function ($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function (chat) {
    Chats.remove(chat);
  };
});

app.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
});

app.controller('AccountCtrl', function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
});


app.controller('CameraCtrl', function ($scope, $cordovaCamera, $http, $ionicPopup, $cordovaGeolocation) {

  $scope.pictureUrl = 'http://placehold.it/300x300';
  //Longitude und Latitude Variablen, die immer wieder überschrieben werden.
  var lat;
  var long;

//optionen für den Location Service.
  var watchOptions = {
    timeout: 1000,
    enableHighAccuracy: false // may cause errors if true
  };

  //userposition wird immer wieder aufgerufen.
  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function (err) {
      // error
    },
    function (position) {
      console.log("watchposition : " + position);
      lat = position.coords.latitude;
      long = position.coords.longitude;
    });


  //diese Funktion startet die Kamera.
  $scope.takePicture = function () {

    //Optionen Für die Kamera
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {

      $scope.pictureUrl = "data:image/jpeg;base64," + imageData;
      sendPhoto(imageData);
    }, function (err) {
      // error
    });

  }

  function sendPhoto(image) {

    var url = "http://193.5.58.95/api/v1/tests";


    var data = lat + " : " + long;
    var comment = "Hier steht der Kommentar drin";
    var b64 = image;

    var output = {
      data: data,
      comment: comment,
      base64: b64
    }

    var confirmPopup = $ionicPopup.confirm({
      title: 'Nice Picture',
      template: 'Do you want to upload this Picture?'
    });


    confirmPopup.then(function (res) {
      if (res) {
        $http.post(url, output, {headers: {'Content-Type': 'application/json'}})
          .then(function (response) {
            watch.clearWatch();
          });
      } else {
        //der user hat das Bild verworfen.
        $scope.pictureUrl = 'http://placehold.it/300x300';
      }
    });
  }


});

app.controller('GpsCtrl', function ($scope) {
  console.log("im GPS controller");
})

app.controller('GalleryCtrl', function ($scope, $http) {


  function gibDatenaus(daten) {
    var daten = daten;
    var urlListen = [];

    for (item in daten) {
      for (subItem in daten[item]) {
        $scope.urllisten.push(daten[item][subItem]);
        console.log($scope.urllisten);
      }
    }
  }

  $scope.bilderDownload = function () {
    getUrl = "http://193.5.58.95/api/v1/tests";

    $scope.urllisten = [];


    $http.get(getUrl).success(function (data) {
      console.log("success!");
      console.log(data);
      gibDatenaus(data);

      //   console.log(data.data.img_path);
    });
  }


});

app.controller('LoginCtrl', function ($scope, $http, $state) {
  var token;
  var loginUrl = 'http://193.5.58.95/api/v1/authenticate';
  $scope.pictureUrl = "img/icon_without_radius.jpg";
  console.log("bin im login Controller");

  $scope.logIn = function () {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var headers = {headers: {'Content-Type': 'application/json'}};
    var data = {
      username: username,
      email: username,
      password: password
    }

    $http.post(loginUrl, data, headers).then(function (resp) {
      console.log(resp);
      //    console.log(resp.statusText + "status");
      //    console.log("Sry bro. falsche anmeldedaten");
      token = resp.data.token;
      console.log("das ist der Token  " + token);
      if (resp.status == 200) {
        $state.go("tab.upload");
      }

    }, function (fail) {
      console.log(fail);
    });

  }


});


app.controller('RegisterCtrl', function ($scope, $http, $state) {

  $scope.pictureUrl = "img/icon_without_radius.jpg";
  var registerUrl = 'http://193.5.58.95/api/v1/authenticate/register'
  console.log("bin im register Controller");


  $scope.register = function () {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var mail = document.getElementById("mail").value;

    console.log("Eingaben :" + username + password + mail);
    var headers = {headers: {'Content-Type': 'application/json'}};
    var data = {
      username: username,
      email: mail,
      password: password
    }

    $http.post(registerUrl, data, headers).then(function (resp) {
      console.log(resp);
      //    console.log(resp.statusText + "status");
      //    console.log("Sry bro. falsche anmeldedaten");

      console.log(resp);
      if (resp.statusText === "OK") {
        $state.go("tab.upload");
      }
    }, function (fail) {
      console.log(fail);
    })

  }

});


app.controller('SettingCtrl', function ($scope) {
  console.log()
});

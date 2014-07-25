$(document).ready(function() {
    var widget = new Auth0Widget({
        domain: 'samples.auth0.com',
        clientID: 'BUIJSW9x60sIHBw8Kd9EmCbj8eDIFxDC',
        callbackURL: location.href,
        callbackOnLocationHash: true
    });

    var loginHash = widget.parseHash(location.hash);
    var userProfile;
    if (loginHash) {
      localStorage.setItem('userToken', loginHash.id_token);
    }


    var token = localStorage.getItem('userToken');
    if (token) {
      widget.getProfile(token, function (err, profile) {
        if (err) {
          // Error callback
          console.log("There was an error");
          alert("There was an error logging in");
        } else {
          // Success calback

          // Save the JWT token.


          // Save the profile
          userProfile = profile;

          $('.login-box').hide();
          $('.logged-in-box').show();
          $('.nickname').text(profile.nickname);
        }
      });
    } else {
      widget.getClient().getSSOData(function(err, data) {
        if (err) {
          return;
        }

        if (data.sso) {
          widget.getClient().signin({connection: data.lastUsedConnection.strategy});
        } else {
          $('.login-box').show();
        }
      });
    }




    $('.btn-login').click(function(e) {
      e.preventDefault();
      widget.signin({} , null);
    });


    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('userToken'));
        }
      }
    });

    $('.btn-api').click(function(e) {
        // Just call your API here. The header will be sent
    })


});

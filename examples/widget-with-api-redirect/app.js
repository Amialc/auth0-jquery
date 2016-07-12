$(document).ready(function() {
      var lock = new Auth0Lock(
      // All these properties are set in auth0-variables.js
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN,
      {
        auth: {
          params: { scope: 'openid' }
        }
      }
    );

    var userProfile;

    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.show();	
    });

    lock.on("authenticated", function(authResult) {
      lock.getProfile(authResult.idToken, function(error, profile) {
        if (error) {
          // Handle error
          return;
        }

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        userProfile = profile;
        showLoggedIn();
      });
    });

	  //retrieve the profile:
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error geting the profile: ' + err.message);
        }
        
        userProfile = profile;
        showLoggedIn();          	
      });
    }

    function showLoggedIn() {
      $('.login-box').hide();
      $('.logged-in-box').show();
      $('.name').text(userProfile.name);
      $('.avatar').attr('src', userProfile.picture);
    }

    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('id_token')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('id_token'));
        }
      }
    });

    $('.btn-api').click(function(e) {
      // Just call your API here. The header will be sent
      $.ajax({
        url: 'http://localhost:3001/secured/ping',
        method: 'GET'
      }).then(function(data, textStatus, jqXHR) {
        alert("The request to the secured enpoint was successfull");
      }, function() {
        alert("You need to download the server seed and start it to call this API");
      });
    });
});

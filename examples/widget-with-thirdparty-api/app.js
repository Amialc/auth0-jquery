$(document).ready(function() {
    var lock = new Auth0Lock(
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
    );
    var auth0 = new Auth0({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
    });

    var userProfile;

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
        getDelegationToken();
      });
    });

    //if user already authenticated (have id_token)
    getDelegationToken();
    
    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.show();
    });

    function getDelegationToken() {
        var id_token = localStorage.getItem('id_token');
        if (id_token) {
            lock.getProfile(id_token, function (err, profile) {
                if (err) {
                    console.log('Cannot get user', err);
                    return;
                }

                console.log("Auth0 token", id_token);
                var delegationOptions = {
                    id_token: id_token,
                    api: API_TYPE
                };
                auth0.getDelegationToken(delegationOptions,
                    function (err, thirdPartyApiToken) {
                        if (err) {
                            console.log("There was an error getting a delegation token: " + JSON.stringify(err));
                        } else {
                            localStorage.setItem('thirdPartyApiToken', thirdPartyApiToken.id_token);
                            console.log("Third party token", thirdPartyApiToken.id_token);
                        }
                    });
                // Save the profile
                userProfile = profile;
                showLoggedIn();
            });
        }
    }

    function showLoggedIn() {
        $('.login-box').hide();
        $('.logged-in-box').show();
        $('.name').text(userProfile.name);
    }

    $('.btn-api').click(function(e) {
        // Just call your API here. The header will be sent
    });


});

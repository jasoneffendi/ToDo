const FB = require('fb')

class fbCtrl{
    static info(req,res) {
        FB.api('me', { fields: ['id', 'name','email'], access_token: req.body.FBtoken }, function (response) {
            console.log(response);
            return response.data
        });
    }
}
if (!lib) var lib = {}

lib.twitterapi = {
use_oauth: false,

username: '',

password: '',

api_base: 'http://api.twitter.com/1',

error_handle:
function error_handle(xhr, textStatus, errorThrown) {
    alert(xhr.status);
    return;
},

basic_auth:
function basic_auth() {
    return 'Basic ' + encodeBase64(
        lib.twitterapi.username + ':' + lib.twitterapi.password);
},

get:
function get(url, params, on_success) {
    lib.twitterapi.do_ajax('GET', url, params, on_success);
},

post:
function post(url, params, on_success) {
    lib.twitterapi.do_ajax('POST', url, params, on_success);
},

do_ajax:
function do_ajax(method, ajax_url, params, on_success) {
    if (this.use_oauth) {
        var signed_params = jsOAuth.form_signed_params(
            lib.twitterapi.api_base + ajax_url
            , jsOAuth.access_token
            , method
            , params);
        utility.Console.out('PARAMS:'+signed_params);
        $.ajax({    
            type: method,
            url: lib.twitterapi.api_base + ajax_url,
            data: signed_params,
            success: 
            function(result) {
                if ( on_success != null)
                    on_success(result);
            },
            error:
            function(result) {
                lib.twitterapi.error_handle(result);
            }
        }); 
    } else {
        $.ajax({    
            type: method,
            url: lib.twitterapi.api_base + ajax_url,
            data: params,
            beforeSend: 
            function(xhr) {
                xhr.setRequestHeader('Authorization', 
                    lib.twitterapi.basic_auth());
            },
            success: 
            function(result) {
                if ( on_success != null)
                    on_success(result);
            },
            error:
            function(result) {
                lib.twitterapi.error_handle(result);
            }
        }); 
    }
},

update_status:
function update_status(text, reply_to_id, on_success) {
    var url = '/statuses/update.json';
    var params = {
        'status': text,
        'in_reply_to_status_id': reply_to_id,
    };
    lib.twitterapi.post(url, params, on_success);
},

retweet_status:
function retweet_status(retweet_id, on_success) {
    var url = '/statuses/retweet/'+retweet_id+'.json';
    lib.twitterapi.post(url, {}, on_success);
},

new_direct_messages:
function new_direct_messages(text, user_id, screen_name, on_success) {
    var url = '/direct_messages/new.json';
    var params = {
        'text': text,
        'screen_name': screen_name,
    };
    if (user_id != null)
        params['user_id'] = user_id;
    lib.twitterapi.post(url, params, on_success);
},

create_favorite:
function create_favorite(fav_id, on_success) {
    var url = '/favorites/create/'+fav_id+'.json';
    lib.twitterapi.post(url, {}, on_success);
},

get_home_timeline:
function get_home_timeline(since_id, max_id, count, on_success) {
    var url = '/statuses/home_timeline.json';
    var params={
        'page': '0',
        'since_id': since_id,
        'count': count,
    };
    if (max_id != null)
        params['max_id'] = max_id;

    lib.twitterapi.get(url, params, on_success);
    return;
},

get_mentions:
function get_mentions(since_id, max_id, count, on_success) {
    var url = '/statuses/mentions.json';
    var params={
        'page': '0',
        'since_id': since_id,
        'count': count,
    };
    if (max_id != null)
        params['max_id'] = max_id;
    lib.twitterapi.get(url, params, on_success);
    return;
},

get_favorites:
function get_favorites(id, page, on_success) {
    var url = '/favorites.json';
    var params={
        'id': id,
        'page': page,
    };
    lib.twitterapi.get(url, params, on_success);
    return;
},

get_direct_messages:
function get_direct_messages(since_id, max_id, count, on_success) {
    var url = '/direct_messages.json';
    var params={
        'page': '0',
        'since_id': since_id,
        'count': count,
    };
    if (max_id != null)
        params['max_id'] = max_id;
    lib.twitterapi.get(url, params, on_success);
    return;
},

verify:
function verify(on_success) {
    var url = '/account/verify_credentials.json';
    lib.twitterapi.get(url, {}, on_success);
},

};

if (typeof ui == 'undefined') var ui = {};
ui.PinDlg = {

me: {},

id: '',

mask: {},

init:
function init () {
    ui.PinDlg.id = '#oauth_dlg';
    ui.PinDlg.me = $('#oauth_dlg');
    ui.PinDlg.mask = $('#dialog_mask');
    // bind events
    $(ui.PinDlg.me).parent().children('.dialog_close_btn').click(
    function (event) {
        ui.PinDlg.hide();
    });

    $('#btn_oauth_pin_ok').click(
    function (event) {
        var pin_code = $.trim($('#tbox_oauth_pin').attr('value'));
        if (pin_code == '') 
            return
        jsOAuth.get_access_token(pin_code,
        function (result) {
            globals.myself = eval(result);
            $('#my_profile_img').attr('src'
                    , globals.myself.profile_image_url);

            ui.Notification.set('Authentication OK!')
            // get a new access_token, dump it to disk.
            hotot_action(
                'token/dump/' + jsOAuth.dump_token(jsOAuth.access_token));
            // change to main view
            ui.PinDlg.hide();
            ui.Welcome.hide();
            ui.Main.show();
            globals.layout.open('north');
            globals.layout.open('south');
        },
        function (xhr, textStatus, errorThrown) {
            ui.PinDlg.hide();
            on_twitterapi_error(xhr, textStatus, errorThrown);
        });
    });

    $('#btn_oauth_pin_cancel').click(
    function (event) {
        ui.PinDlg.hide();
    });

    $('#btn_oauth_user_auth').click(
    function (event) {
        navigate_action($(this).attr('href'));
        return false;
    });

    return this;
},

hide:
function hide () {
    this.mask.fadeOut();
    this.me.parent().hide();
    return this;
},

show:
function show () {
    this.me.parent().show();
    this.mask.fadeIn();
    return this;
},

set_auth_url:
function set_auth_url(url) {
    $('#btn_oauth_user_auth').attr('href', url);
},

}



$(document).ready(function () {
    var currentProxy = null;
    var ipSpan = $('#ip');
    var portSpan = $('#port');
    var countrySpan = $('#country');
    var pingSpan = $('#ping');
    var lossSpan = $('#loss');

    function updateProxy() {
        $.get('/proxy', null, function (data) {
            currentProxy = data;
            ipSpan.text(currentProxy.server);
            portSpan.text(currentProxy.port);
            countrySpan.text(currentProxy.country);
            pingSpan.text(currentProxy.ping_time_ms);
            lossSpan.text(Math.floor(currentProxy.loss_ratio * 100));
        });
    }

    function toTelegram() {
        var win = window.open(`tg://socks?server=${currentProxy.server}&port=${currentProxy.port}`, '_blank');
        win.focus();
        setTimeout(() => {win.close();}, 1000);
    }

    updateProxy();

    $('#refresh').click(updateProxy);
    $('#telegram').click(toTelegram);
});
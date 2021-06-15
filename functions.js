$(document).ready(function(){
	$("#OtherTokenValue").on("input", function() {
        SwitchTokenLabel();
        if ($("#OtherTokenValue").val() == "USDT") {
            $("#cPriceToken").val(1).change();
            $("#cPriceToken").prop("disabled", true);
            $("#cPriceToken").parent().addClass("auto");
            $("#fPriceToken").val(1).change();
            $("#fPriceToken").prop("disabled", true);
            $("#fPriceToken").parent().addClass("auto");
        } else {
            $("#cPriceToken").val("").change();
            $("#fPriceToken").val("").change();
            if (!$("#cPriceDFI").prop("disabled")) {
                $("#cPriceToken").prop("disabled", false);
                $("#cPriceToken").parent().removeClass("auto");
            }
            if (!$("#fPriceDFI").prop("disabled")) {
                $("#fPriceToken").prop("disabled", false);
                $("#fPriceToken").parent().removeClass("auto");
            }
        }
    });
    SwitchTokenLabel();
    $('.js-example-templating').select2({
        minimumResultsForSearch: -1,
        width: '100%',
        dropdownAutoWidth : true,
        templateResult: formatCoin,
        templateSelection: formatCoin,
        escapeMarkup: function (m) {
				return m;
			}
    });

    $("#cPriceToken").on("change input", function() {
        calcPriceRatio("c");
        calculate();
    });
    $("#cPriceDFI").on("change input", function() {
        calcPriceRatio("c");
        calculate();
    });
    $("#cPriceRatio").on("change input", function() {
        priceRatio("c");
        calculate();
    });

    $("#cAmountDFI").on("change input", function() {
        calculate();
    });
    
    $("#fPriceToken").on("change input", function() {
        calcPriceRatio("f");
        calculate();
    });
    $("#fPriceDFI").on("change input", function() {
        calcPriceRatio("f");
        calculate();
    });
    $("#fPriceRatio").on("change input", function() {
        priceRatio("f");
        calculate();
    });

    $("#apr").on("change input", function() {
        calculate();
    });
    $("#fee").on("change input", function() {
        calculate();
    });
    $("#duration").on("change input", function() {
        calculate();
    });

    $(document).keydown(function(e){
    if (e.which == 27) {
       $('body').chardinJs('stop');
       return false;
    }
    });
    //$('body').chardinJs('start');
});

function SwitchTokenLabel() {
    var label = $("#OtherTokenValue").val();
    $("#OtherTokenValue").innerHTML = coinNameToImg(label);
    $("[name='OtherToken']").map(function() {
        this.innerHTML = coinNameToImg(label);
    });
    $("[name='OtherRatio']").map(function() {
        this.innerHTML = coinNameToImg(label);
    });
}

function formatCoin(coin) {
    if (!coin.id) {
        return coin.text;
    }

    var $coin = $(coinNameToImg(coin.text));
    return $coin;
}

function coinNameToImg(coinName) {
    return '<img src="img/' + coinName + '.svg" class="img-flag"/>';
}

function prettyNumber(number) {
    if (number == "")
        return "";

    return numbro(number).format({trimMantissa: true,
                                  thousandSeparated: true
    });
}

function priceRatio(time) {
    var priceToken = "#" + time + "PriceToken";
    var priceDFI   = "#" + time + "PriceDFI";
    var priceRatio = "#" + time + "PriceRatio";

    if ($(priceRatio).val() ) {
        $(priceDFI).prop("disabled", true);
        $(priceDFI).parent().addClass("auto");
        $(priceToken).prop("disabled", true);
        $(priceToken).parent().addClass("auto");
    } else {
        $(priceDFI).prop("disabled", false);
        $(priceDFI).parent().removeClass("auto");
        $(priceToken).prop("disabled", false);
        $(priceToken).parent().removeClass("auto");
    }
}

function calcPriceRatio(time) {
    var priceToken = "#" + time + "PriceToken";
    var priceDFI   = "#" + time + "PriceDFI";
    var priceRatio = "#" + time + "PriceRatio";

    if ($(priceToken).val() || $(priceDFI).val()) {
        $(priceRatio).prop("disabled", true);
        $(priceRatio).parent().addClass("auto");

        if ($(priceToken).val() && $(priceDFI).val()) {
            $(priceRatio).val(prettyNumber(($(priceToken).val() / $(priceDFI).val())));
            return
        } else if ($("#OtherTokenValue").val() == "USDT") {
            $(priceRatio).prop("disabled", false);
            $(priceRatio).parent().removeClass("auto");
        }
    } else {
        $(priceRatio).prop("disabled", false);
        $(priceRatio).parent().removeClass("auto");
    }
    if (!$(priceDFI).prop("disabled") && !$(priceDFI).prop("disabled")) {
        $(priceRatio).val("");
    }
}

function compareValues(value1, value2, id1, id2, colorType) {
    // clear previous results
    $(id1).parent().removeClass("plus" + colorType);
    $(id1).parent().removeClass("minus" + colorType);
    $(id2).parent().removeClass("plus" + colorType);
    $(id2).parent().removeClass("minus" + colorType);

    if ((value1 == value2) || (value1 == 0) || (value2 == 0)){
        return;
    }
    else if (value1 > value2) {
        $(id1).parent().addClass("plus" + colorType);
        $(id2).parent().addClass("minus" + colorType);
    } else {
        $(id1).parent().addClass("minus" + colorType);
        $(id2).parent().addClass("plus" + colorType);
    }
}

function calculate() {
    var cPriceDFI    = 0;
    var cPriceToken  = 0;

    var cAmountDFI   = 0;
    var cAmountToken = 0;

    var cValueDFI    = 0;
    var cValueToken  = 0;
    var cValue       = 0;

    var fAmountDFI   = 0;
    var fAmountToken = 0;

    var fValueDFI    = 0;
    var fValueToken  = 0;
    var fValue       = 0;

    var fValueDFII   = 0;
    var fValueTokenI = 0;
    var fValueI      = 0;

    var fValueDFIH   = 0;
    var fValueTokenH = 0;
    var fValueH      = 0;

    if ($("#cAmountDFI").val()) {
        var cPriceRatio  = 0;
        cAmountDFI   = +$("#cAmountDFI").val();

        if ($("#cPriceToken").val() && $("#cPriceDFI").val()) {
            cPriceToken  = +$("#cPriceToken").val();
            cPriceDFI    = +$("#cPriceDFI").val();
            cPriceRatio  = cPriceToken / cPriceDFI;
        } else if ($("#cPriceRatio").val()) {
            cPriceRatio  = +$("#cPriceRatio").val();
        }

        cAmountToken = cAmountDFI/cPriceRatio;
        cValueToken  = cAmountToken * cPriceToken;
        cValueDFI    = cAmountDFI * cPriceDFI;
        cValue       = cValueToken + cValueDFI;

        var fPriceToken  = +$("#fPriceToken").val();
        var fPriceDFI    = +$("#fPriceDFI").val();
        var fPriceRatio  = +$("#fPriceRatio").val();

        if ($("#fPriceToken").val() && $("#fPriceDFI").val()) {

            fPriceRatio  = fPriceToken / fPriceDFI;

            if ((fPriceDFI == cPriceDFI) && (fPriceToken == cPriceToken)) {
                fAmountDFI   = cAmountDFI;
                fAmountToken = cAmountToken;
            }
        }

        if (fPriceRatio) {
            /* The ratio of tokens in the pool
            is the same as the ratio of prices
            cPriceDFI / cPriceToken = cAmountToken / cAmountDFI
            fPriceDFI / fPriceToken = fAmountToken / fAmountDFI

            AND

            Per the constant product formula x * y = k
            cAmountToken * cAmountDFI = k
            and
            fAmountToken * fAmountDFI = k
            hence
            cAmountToken * cAmountDFI = fAmountToken * fAmountDFI

            So
            fAmountToken = cAmountToken * cAmountDFI / fAmountDFI
            fAmountDFI = (fPriceToken / fPriceDFI) * fAmountToken
            fAmountToken = cAmountToken * cAmountDFI / ((fPriceToken / fPriceDFI) * fAmountToken)
            fAmountToken = cAmountToken * cAmountDFI / ((fPriceToken * fAmountToken) / fPriceDFI)
            fAmountToken = cAmountToken * cAmountDFI * fPriceDFI / (fPriceToken * fAmountToken)
            fAmountToken^2 = cAmountToken * cAmountDFI * fPriceDFI / fPriceToken
            fAmountToken = sqrt(cAmountToken * cAmountDFI * fPriceDFI / fPriceToken) */

            if ((!fAmountToken) && (!fAmountDFI)) {
                fAmountToken = Math.sqrt(cAmountToken * cAmountDFI * 1/fPriceRatio);
                fAmountDFI   = (fPriceRatio * fAmountToken);
            }

            fValueToken  = fAmountToken * fPriceToken;
            fValueDFI    = fAmountDFI * fPriceDFI;
            fValue       = fValueToken + fValueDFI;

            fValueTokenH  = cAmountToken * fPriceToken;
            fValueDFIH    = cAmountDFI * fPriceDFI;
            fValueH       = fValueTokenH + fValueDFIH;

            if (($("#apr").val() || $("#fee").val()) && $("#duration").val() ) {
                var apr      = +$("#apr").val();
                var fee      = +$("#fee").val();
                var duration = +$("#duration").val();

                fAmountDFII   = fAmountDFI + (fAmountDFI * ( 2 * apr + fee) * duration /(100*365));
                fAmountTokenI = fAmountToken + (fAmountToken * fee * duration /(100*365));
                fValueTokenI  = fAmountTokenI * fPriceToken;
                fValueDFII    = fAmountDFII * fPriceDFI;
                fValueI       = fValueTokenI + fValueDFII;
            }
        }
    }

    $("#cAmountToken").val(prettyNumber(cAmountToken));
    $("#cValueToken").val(prettyNumber(cValueToken));
    $("#cValueDFI").val(prettyNumber(cValueDFI));
    $("#cValue").val(prettyNumber(cValue));

    $("#fAmountToken").val(prettyNumber(fAmountToken));
    $("#fAmountDFI").val(prettyNumber(fAmountDFI));

    compareValues(fAmountDFI, cAmountDFI, "#fAmountDFI", "#cAmountDFI", "-A");
    compareValues(fAmountToken, cAmountToken, "#fAmountToken", "#cAmountToken", "-A");

    $("#fValueToken").val(prettyNumber(fValueToken));
    $("#fValueDFI").val(prettyNumber(fValueDFI));
    $("#fValue").val(prettyNumber(fValue));

    $("#fValueTokenH").val(prettyNumber(fValueTokenH));
    $("#fValueDFIH").val(prettyNumber(fValueDFIH));
    $("#fValueH").val(prettyNumber(fValueH));

    compareValues(fValueDFIH, fValueDFI, "#fValueDFIH", "#fValueDFI", "-V");
    compareValues(fValueTokenH, fValueToken, "#fValueTokenH", "#fValueToken", "-V");
    compareValues(fValueH, fValue, "#fValueH", "#fValue", "-V");

    $("#fValueTokenI").val(prettyNumber(fValueTokenI));
    $("#fValueDFII").val(prettyNumber(fValueDFII));
    $("#fValueI").val(prettyNumber(fValueI));

    compareValues(fValueDFIH, fValueDFII, "#fValueDFIH", "#fValueDFII", "-V");
    compareValues(fValueTokenH, fValueTokenI, "#fValueTokenH", "#fValueTokenI", "-V");
    compareValues(fValueH, fValueI, "#fValueH", "#fValueI", "-V");
}

$(document).ready(function(){
    /*$('#fullpage').fullpage({
		//options here
		autoScrolling: true,
        continuousVertical: true,
		scrollHorizontally: true,
        paddingTop: 0,
        paddingBottom: 0,
	});*/

	//methods
	//$.fn.fullpage.setAllowScrolling(false);

	$("#OtherTokenValue").on("input", function() {
        SwitchTokenLabel();
        if ($("#OtherTokenValue").val() == "USDT") {
            $("#cPriceToken").val(1);
            $("#cPriceToken").prop("disabled", true);
            $("#cPriceToken").parent().addClass("auto");
        } else {
            $("#cPriceToken").val("");
            $("#cPriceToken").prop("disabled", false);
            $("#cPriceToken").parent().removeClass("auto");
        }
    });
    
    $("#cPriceToken").on("input", function() {
        cPriceRatio();
        calculate();
    });
    $("#cPriceDFI").on("input", function() {
        cPriceRatio();
        calculate();
    });

    $("#cAmountDFI").on("input", function() {
        calculate();
    });
    
    $("#fPriceToken").on("input", function() {
        fPriceRatio();
        calculate();
    });
    $("#fPriceDFI").on("input", function() {
        fPriceRatio();
        calculate();
    });

    toggleInterest();
    $("#interest").on("input", function() {
        toggleInterest()
        calculate();
    });
    $("#apr").on("input", function() {
        calculate();
    });
    $("#fee").on("input", function() {
        calculate();
    });
    $("#duration").on("input", function() {
        calculate();
    });
});

function SwitchTokenLabel() {
    var label = $("#OtherTokenValue").val();
    $("[name='OtherToken']").map(function() {
        this.innerHTML = label;
    });
}

function toggleInterest() {
    if ($("#interest:checked").val()) {
            $("#apr").prop("disabled", false);
            $("#apr").parent().removeClass("auto");
            $("#duration").prop("disabled", false);
            $("#duration").parent().removeClass("auto");
            $("#fee").prop("disabled", false);
            $("#fee").parent().removeClass("auto");
        } else {
            $("#apr").prop("disabled", true);
            $("#apr").parent().addClass("auto");
            $("#duration").prop("disabled", true);
            $("#duration").parent().addClass("auto");
            $("#fee").prop("disabled", true);
            $("#fee").parent().addClass("auto");
        }
}

function prettyNumber(number) {
    if (number == "")
        return "";

    return numbro(number).format({trimMantissa: true,
                                  average: true,
                                  totalLength: 9
    });
}

function cPriceRatio() {
    if ($("#cPriceToken").val() && $("#cPriceDFI").val()) {
        $("#cPriceRatio").val("1:" + prettyNumber(($("#cPriceDFI").val() / $("#cPriceToken").val())));
    } else {
        $("#cPriceRatio").val("");
    }
}

function fPriceRatio() {
    if ($("#fPriceToken").val() && $("#fPriceDFI").val()) {
        $("#fPriceRatio").val("1:" + prettyNumber(($("#fPriceDFI").val() / $("#fPriceToken").val())));
    } else {
        $("#fPriceRatio").val("");
    }
}

function compareValues(value1, value2, id1, id2) {
    // clear previous results
    $(id1).parent().removeClass("plus");
    $(id1).parent().removeClass("minus");
    $(id2).parent().removeClass("plus");
    $(id2).parent().removeClass("minus");

    if ((value1 == value2) || (value1 == 0) || (value2 == 0)){
        return;
    }
    else if (value1 > value2) {
        $(id1).parent().addClass("plus");
        $(id2).parent().addClass("minus");
    } else {
        $(id1).parent().addClass("minus");
        $(id2).parent().addClass("plus");
    }
}

function calculate() {
    var cPriceDFI = 0;
    var cPriceToken = 0;

    var cAmountDFI = 0;
    var cAmountToken = 0;

    var cValueToken = 0;
    var cValueDFI = 0;
    var cValue = 0;

    var fAmountToken = 0;
    var fAmountDFI = 0;

    var fValueToken = 0;
    var fValueDFI = 0;
    var fValue = 0;

    var fValueTokenH = 0;
    var fValueDFIH = 0;
    var fValueH = 0;

    if ($("#cAmountDFI").val() &&
        $("#cPriceToken").val() && $("#cPriceDFI").val()) {
    
        cAmountDFI   = +$("#cAmountDFI").val();
        cPriceToken  = +$("#cPriceToken").val();
        cPriceDFI    = +$("#cPriceDFI").val();
        cAmountToken = cPriceDFI/cPriceToken *cAmountDFI;

        cValueToken  = cAmountToken * cPriceToken;
        cValueDFI    = cAmountDFI * cPriceDFI;
        cValue       = cValueToken + cValueDFI;

        if ($("#fPriceToken").val() && $("#fPriceDFI").val()) {

            var fPriceToken  = +$("#fPriceToken").val();
            var fPriceDFI    = +$("#fPriceDFI").val();

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

            fAmountToken = Math.sqrt(cAmountToken * cAmountDFI * fPriceDFI / fPriceToken);
            fAmountDFI   = (fPriceToken / fPriceDFI * fAmountToken);

            if ( $("#interest:checked").val() &&
                $("#apr").val() && $("#duration").val() ) {
                var apr      = +$("#apr").val();
                var fee      = +$("#fee").val();
                var duration = +$("#duration").val();

                fAmountDFI   = fAmountDFI + (2 * fAmountDFI * ( apr + fee) * duration /(100*365));
                fAmountToken = fAmountToken + (fAmountDFI * fee * duration /(100*365));
            }

            fValueToken  = fAmountToken * fPriceToken;
            fValueDFI    = fAmountDFI * fPriceDFI;
            fValue       = fValueToken + fValueDFI;

            fValueTokenH  = cAmountToken * fPriceToken;
            fValueDFIH    = cAmountDFI * fPriceDFI;
            fValueH       = fValueTokenH + fValueDFIH;
        }
    }

    $("#cAmountToken").val(prettyNumber(cAmountToken));
    $("#cValueToken").val(prettyNumber(cValueToken));
    $("#cValueDFI").val(prettyNumber(cValueDFI));
    $("#cValue").val(prettyNumber(cValue));

    $("#fAmountToken").val(prettyNumber(fAmountToken));
    $("#fAmountDFI").val(prettyNumber(fAmountDFI));

    compareValues(fAmountDFI, cAmountDFI, "#fAmountDFI", "#cAmountDFI");
    compareValues(fAmountToken, cAmountToken, "#fAmountToken", "#cAmountToken");

    $("#fValueToken").val(prettyNumber(fValueToken));
    $("#fValueDFI").val(prettyNumber(fValueDFI));
    $("#fValue").val(prettyNumber(fValue));

    $("#fValueTokenH").val(prettyNumber(fValueTokenH));
    $("#fValueDFIH").val(prettyNumber(fValueDFIH));
    $("#fValueH").val(prettyNumber(fValueH));

    compareValues(fValueDFIH, fValueDFI, "#fValueDFIH", "#fValueDFI");
    compareValues(fValueTokenH, fValueToken, "#fValueTokenH", "#fValueToken");
    compareValues(fValueH, fValue, "#fValueH", "#fValue");
}

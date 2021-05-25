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

    if (value1 == value2) {
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
    if (!$("#cAmountDFI").val() ||
        !$("#cPriceToken").val() || !$("#cPriceDFI").val())
        return;
    
    var cAmountDFI   = +$("#cAmountDFI").val();
    var cPriceToken  = +$("#cPriceToken").val();
    var cPriceDFI    = +$("#cPriceDFI").val();
    var cAmountToken = cPriceDFI/cPriceToken *cAmountDFI;
    $("#cAmountToken").val(prettyNumber(cAmountToken));

    var cValueToken  = cAmountToken * cPriceToken;
    var cValueDFI    = cAmountDFI * cPriceDFI;
    var cValue       = cValueToken + cValueDFI;
    $("#cValueToken").val(prettyNumber(cValueToken));
    $("#cValueDFI").val(prettyNumber(cValueDFI));
    $("#cValue").val(prettyNumber(cValue));
    
    if (!$("#fPriceToken").val() || !$("#fPriceDFI").val())
        return;

    var fPriceToken  = +$("#fPriceToken").val();
    var fPriceDFI    = +$("#fPriceDFI").val();
    var fPriceRatio  = fPriceDFI / fPriceToken;

    // The ratio of tokens in the pool
    // is the same as the ratio of prices
    // cPriceDFI / cPriceToken = cAmountToken / cAmountDFI
    // fPriceDFI / fPriceToken = fAmountToken / fAmountDFI
    

    // AND

    // Per the constant product formula x * y = k
    // cAmountToken * cAmountDFI = k
    // and
    // fAmountToken * fAmountDFI = k
    // hence
    // cAmountToken * cAmountDFI = fAmountToken * fAmountDFI
    
    // So
    // fAmountToken = cAmountToken * cAmountDFI / fAmountDFI
    // fAmountDFI = (fPriceToken / fPriceDFI) * fAmountToken
    // fAmountToken = cAmountToken * cAmountDFI / ((fPriceToken / fPriceDFI) * fAmountToken)
    // fAmountToken = cAmountToken * cAmountDFI / ((fPriceToken * fAmountToken) / fPriceDFI)
    // fAmountToken = cAmountToken * cAmountDFI * fPriceDFI / (fPriceToken * fAmountToken)
    // fAmountToken^2 = cAmountToken * cAmountDFI * fPriceDFI / fPriceToken
    // fAmountToken = sqrt(cAmountToken * cAmountDFI * fPriceDFI / fPriceToken)
    
    fAmountToken = Math.sqrt(cAmountToken * cAmountDFI * fPriceDFI / fPriceToken);
    fAmountDFI   = (fPriceToken / fPriceDFI * fAmountToken);
    
    $("#fAmountToken").val(prettyNumber(fAmountToken));
    if (fAmountToken > cAmountToken)
        $("#fAmountTokenDifference").val("(+" + prettyNumber(fAmountToken - cAmountToken) + ")");
    else if (fAmountToken < cAmountToken)
        $("#fAmountTokenDifference").val("(" + prettyNumber(fAmountToken - cAmountToken) + ")");
    else
        $("#fAmountTokenDifference").val("");
    
    $("#fAmountDFI").val(prettyNumber(fAmountDFI));
    if (fAmountDFI > cAmountDFI)
        $("#fAmountDFIDifference").val("(+" + prettyNumber(fAmountDFI - cAmountDFI) +")");
    else if(fAmountDFI < cAmountDFI)
        $("#fAmountDFIDifference").val("(" + prettyNumber(fAmountDFI - cAmountDFI) + ")");
    else
        $("#fAmountDFIDifference").val("");

    compareValues(fAmountDFI, cAmountDFI, "#fAmountDFI", "#cAmountDFI");
    compareValues(fAmountToken, cAmountToken, "#fAmountToken", "#cAmountToken");

    var fValueToken  = fAmountToken * fPriceToken;
    var fValueDFI    = fAmountDFI * fPriceDFI;
    var fValue       = fValueToken + fValueDFI;
    $("#fValueToken").val(prettyNumber(fValueToken));
    $("#fValueDFI").val(prettyNumber(fValueDFI));
    $("#fValue").val(prettyNumber(fValue));

    var fValueTokenH  = cAmountToken * fPriceToken;
    var fValueDFIH    = cAmountDFI * fPriceDFI;
    var fValueH       = fValueTokenH + fValueDFIH;
    $("#fValueTokenH").val(prettyNumber(fValueTokenH));
    $("#fValueDFIH").val(prettyNumber(fValueDFIH));
    $("#fValueH").val(prettyNumber(fValueH));

    compareValues(fValueDFIH, fValueDFI, "#fValueDFIH", "#fValueDFI");
    compareValues(fValueTokenH, fValueToken, "#fValueTokenH", "#fValueToken");
    compareValues(fValueH, fValue, "#fValueH", "#fValue");

    if ( $("#interest:checked").val() &&
        $("#apr").val() && $("#duration").val() ) {
        var apr      = +$("#apr").val();
        var fee      = +$("#fee").val();
        var duration = +$("#duration").val();
        if (fee == "")
            fee = 0;
        var fAmountDFII   = fAmountDFI + (2 * fAmountDFI * ( apr + fee) * duration /(100*365));
        var fAmountTokenI = fAmountToken + (fAmountDFI * fee * duration /(100*365));
        $("#fAmountDFI").val(prettyNumber((fAmountDFII)));
        $("#fAmountToken").val(prettyNumber((fAmountTokenI)));
        if (fAmountDFII > cAmountDFI)
            $("#fAmountDFIIDifference").val("(+" + prettyNumber(fAmountDFII - cAmountDFI) +")");
        else if(fAmountDFII < cAmountDFI)
            $("#fAmountDFIIDifference").val("(" + prettyNumber(fAmountDFII - cAmountDFI) + ")");
        else
            $("#fAmountDFIIDifference").val("");

        var fValueDFII    = fAmountDFII * fPriceDFI;
        var fValueI       = fValueToken + fValueDFII;
        $("#fValueDFI").val(prettyNumber(fValueDFII));
        $("#fValue").val(prettyNumber(fValueI));

        if (fValueI == fValueH) {
            $("#fValue").parent().removeClass("plus");
            $("#fValue").parent().removeClass("minus");
        } else if (fValueI > fValueH) {
            $("#fValue").parent().addClass("plus");
            $("#fValue").parent().removeClass("minus")
        } else {
            $("#fValue").parent().removeClass("plus");
            $("#fValue").parent().addClass("minus")
        }
    }
}

$(document).ready(function(){
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

    $("#apy").on("input", function() {
        calculate();
    });
    $("#duration").on("input", function() {
        calculate();
    });
    $("#split").on("input", function() {
        calculate();
    });
});

function prettyNumber(number) {
    return numeral(number).format("0,0[.]000");
}

function cPriceRatio() {
    if ($("#cPriceToken").val() && $("#cPriceDFI").val()) {
        $("#cPriceRatio").val("1:" + prettyNumber(($("#cPriceDFI").val() / $("#cPriceToken").val()))).change();
    } else {
        $("#cPriceRatio").val("").change();
    }
}

function fPriceRatio() {
    if ($("#fPriceToken").val() && $("#fPriceDFI").val()) {
        $("#fPriceRatio").val("1:" + prettyNumber(($("#fPriceDFI").val() / $("#fPriceToken").val()))).change();
    } else {
        $("#fPriceRatio").val("").change();
    }
}

function isInBetween(min, max, value) {
    return value >= min && value <= max;
}
    
function calculate() {
    if (!$("#cAmountDFI").val() ||
        !$("#cPriceToken").val() || !$("#cPriceDFI").val())
        return;
    
    var cAmountDFI   = $("#cAmountDFI").val();
    var cPriceToken  = $("#cPriceToken").val();
    var cPriceDFI    = $("#cPriceDFI").val();
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

    var fPriceToken  = $("#fPriceToken").val();
    var fPriceDFI    = $("#fPriceDFI").val();
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

    if (fValue == fValueH) {
        $("#fValue").parent().removeClass("plus");
        $("#fValue").parent().removeClass("minus");
    } else if (fValue > fValueH) {
        $("#fValue").parent().addClass("plus");
        $("#fValue").parent().removeClass("minus")
    } else {
        $("#fValue").parent().removeClass("plus");
        $("#fValue").parent().addClass("minus")
    }

    if ( !$("#apy").val() || !$("#duration").val() )
        return;

    var apy         = $("#apy").val();
    var duration    = $("#duration").val();
    var split       = $("#split:checked").val();
    var halfDFII    = (fAmountDFI * apy * duration /(100*365))
    if (split)
        var fAmountDFII = fAmountDFI + halfDFII;
    else
        var fAmountDFII = fAmountDFI + (2 * halfDFII);
    $("#fAmountDFII").val(prettyNumber((fAmountDFII)));
    if (fAmountDFII > cAmountDFI)
        $("#fAmountDFIIDifference").val("(+" + prettyNumber(fAmountDFII - cAmountDFI) +")");
    else if(fAmountDFII < cAmountDFI)
        $("#fAmountDFIIDifference").val("(" + prettyNumber(fAmountDFII - cAmountDFI) + ")");
    else
        $("#fAmountDFIIDifference").val("");

    if (split)
        var fAmountTokenI = fAmountToken + (halfDFII * fPriceRatio);
    else
        var fAmountTokenI = fAmountToken;

    $("#fAmountTokenI").val(prettyNumber(fAmountTokenI));
    $("#fAmountTokenIDifference").val($("#fAmountTokenDifference").val());

    var fValueTokenI  = fAmountTokenI * fPriceToken;
    var fValueDFII    = fAmountDFII * fPriceDFI;
    var fValueI       = fValueTokenI + fValueDFII;
    $("#fValueTokenI").val(prettyNumber(fValueTokenI));
    $("#fValueDFII").val(prettyNumber(fValueDFII));
    $("#fValueI").val(prettyNumber(fValueI));

    if (fValueI == fValueH) {
        $("#fValueI").parent().removeClass("plus");
        $("#fValueI").parent().removeClass("minus");
    } else if (fValueI > fValueH) {
        $("#fValueI").parent().addClass("plus");
        $("#fValueI").parent().removeClass("minus")
    } else {
        $("#fValueI").parent().removeClass("plus");
        $("#fValueI").parent().addClass("minus")
    }
}

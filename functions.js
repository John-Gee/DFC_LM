$(document).ready(function(){
    $("#cPriceToken").on("input", function() {
        cPriceRatio();
        calculate();
    });
    $("#cPriceDFI").on("input", function() {
        cPriceRatio();
        calculate();
    });

    $("#cAmountToken").on("input", function() {
        cAmountRatio();
        calculate();
    });
    $("#cAmountDFI").on("input", function() {
        cAmountRatio();
        calculate();
    });

    $("#cPriceRatio").change(function() {
        verifyCRatios();
    });
    $("#cAmountRatio").change(function() {
        verifyCRatios();
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
        fPriceRatio();
        calculate();
    });
    $("#duration").on("input", function() {
        fPriceRatio();
        calculate();
    });
});

var precision = 6;

function cPriceRatio() {
    if ($("#cPriceToken").val() && $("#cPriceDFI").val()) {
        $("#cPriceRatio").val("1:" + Number(($("#cPriceDFI").val() / $("#cPriceToken").val()).toPrecision(precision))).change();
    } else {
        $("#cPriceRatio").val("").change();
    }
}

function cAmountRatio() {
    if ($("#cAmountToken").val() && $("#cAmountDFI").val()) {
        $("#cAmountRatio").val("1:" + Number(($("#cAmountToken").val() / $("#cAmountDFI").val()).toPrecision(precision))).change();
    } else {
        $("#cAmountRatio").val("").change();
    }
}

function verifyCRatios() {
    if ( $("#cPriceRatio").val() && $("#cAmountRatio").val() && ($("#cPriceRatio").val() != $("#cAmountRatio").val())) {
        $("#cPriceRatio").addClass("error");
        $("#cAmountRatio").addClass("error");
        $("#commentRatio").addClass("error");
    } else {
        $("#cPriceRatio").removeClass("error");
        $("#cAmountRatio").removeClass("error");
        $("#commentRatio").removeClass("error");
    }
}

function fPriceRatio() {
    if ($("#fPriceToken").val() && $("#fPriceDFI").val()) {
        $("#fPriceRatio").val("1:" + Number(($("#fPriceDFI").val() / $("#fPriceToken").val()).toPrecision(precision))).change();
    } else {
        $("#fPriceRatio").val("").change();
    }
}

function isInBetween(min, max, value) {
    return value >= min && value <= max;
}
    
function calculate() {
    if (!$("#cAmountToken").val() || !$("#cAmountDFI").val() || 
        !$("#cPriceToken").val() || !$("#cPriceDFI").val())
        return;
    
    var cAmountToken = $("#cAmountToken").val();
    var cAmountDFI   = $("#cAmountDFI").val();
    var cPriceToken  = $("#cPriceToken").val();
    var cPriceDFI    = $("#cPriceDFI").val();
    var cValueToken  = cAmountToken * cPriceToken;
    var cValueDFI    = cAmountDFI * cPriceDFI;
    var cValue       = cValueToken + cValueDFI;
    $("#cValueToken").val(cValueToken);
    $("#cValueDFI").val(cValueDFI);
    $("#cValue").val(cValue);
    
    if (!$("#fPriceToken").val() || !$("#fPriceDFI").val())
        return;

    var fPriceToken  = $("#fPriceToken").val();
    var fPriceDFI    = $("#fPriceDFI").val();

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
    
    fAmountToken = Number(Math.sqrt(cAmountToken * cAmountDFI * fPriceDFI / fPriceToken).toPrecision(precision));
    fAmountDFI = Number((fPriceToken / fPriceDFI * fAmountToken).toPrecision(precision));
    
    $("#fAmountToken").val(fAmountToken);
    if (fAmountToken > cAmountToken)
        $("#fAmountTokenDifference").val("(+" + Number((fAmountToken - cAmountToken).toPrecision(precision)) + ")");
    else if (fAmountToken < cAmountToken)
        $("#fAmountTokenDifference").val("(" + Number((fAmountToken - cAmountToken).toPrecision(precision)) + ")");
    else
        $("#fAmountTokenDifference").val("");
    
    $("#fAmountDFI").val(fAmountDFI);
    if (fAmountDFI > cAmountDFI)
        $("#fAmountDFIDifference").val("(+" + Number((fAmountDFI - cAmountDFI).toPrecision(precision)) +")");
    else if(fAmountDFI < cAmountDFI)
        $("#fAmountDFIDifference").val("(" + Number((fAmountDFI - cAmountDFI).toPrecision(precision)) + ")");
    else
        $("#fAmountDFIDifference").val("");

    var fValueToken  = fAmountToken * fPriceToken;
    var fValueDFI    = fAmountDFI * fPriceDFI;
    var fValue       = fValueToken + fValueDFI;
    $("#fValueToken").val(fValueToken);
    $("#fValueDFI").val(fValueDFI);
    $("#fValue").val(fValue);

    var fValueTokenH  = cAmountToken * fPriceToken;
    var fValueDFIH    = cAmountDFI * fPriceDFI;
    var fValueH       = fValueTokenH + fValueDFIH;
    $("#fValueTokenH").val(fValueTokenH);
    $("#fValueDFIH").val(fValueDFIH);
    $("#fValueH").val(fValueH);

    if ( !$("#apy").val() || !$("#duration").val() )
        return;

    var apy         = $("#apy").val();
    var duration    = $("#duration").val();
    var fAmountDFII = fAmountDFI + 2 * fAmountDFI * apy * duration /(100*365);
    $("#fAmountDFII").val(Number((fAmountDFII).toPrecision(precision)));
    if (fAmountDFII > cAmountDFI)
        $("#fAmountDFIIDifference").val("(+" + Number((fAmountDFII - cAmountDFI).toPrecision(precision)) +")");
    else if(fAmountDFII < cAmountDFI)
        $("#fAmountDFIIDifference").val("(" + Number((fAmountDFII - cAmountDFI).toPrecision(precision)) + ")");
    else
        $("#fAmountDFIIDifference").val("");

    var fAmountTokenI = fAmountToken;
    $("#fAmountTokenI").val(fAmountTokenI);
    $("#fAmountTokenIDifference").val($("#fAmountTokenDifference").val());

    var fValueTokenI  = fAmountTokenI * fPriceToken;
    var fValueDFII    = fAmountDFII * fPriceDFI;
    var fValueI       = fValueTokenI + fValueDFII;
    $("#fValueTokenI").val(fValueTokenI);
    $("#fValueDFII").val(fValueDFII);
    $("#fValueI").val(fValueI);
}

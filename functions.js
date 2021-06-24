$(document).ready(function(){
	$("#OtherTokenValue").on("input", function() {
        SwitchTokenLabel();
        if (my$("#OtherTokenValue").value == "USDT") {
            my$("#cPriceToken").value = 1;
            inputEvent("#cPriceToken");
            my$("#cPriceToken").disabled = true;
            my$("#cPriceToken").parentElement.classList.add("auto");
            my$("#fPriceToken").value = 1;
            inputEvent("#fPriceToken");
            my$("#fPriceToken").disabled = true;
            my$("#fPriceToken").parentElement.classList.add("auto");
        } else {
            my$("#cPriceToken").value = "";
            inputEvent("#cPriceToken");
            my$("#fPriceToken").value = "";
            inputEvent("#fPriceToken");
            if (!my$("#cPriceDFI").disabled) {
                my$("#cPriceToken").disabled = false;
                my$("#cPriceToken").parentElement.classList.remove("auto");
            }
            if (!my$("#fPriceDFI").disabled) {
                my$("#fPriceToken").disabled = false;
                my$("#fPriceToken").parentElement.classList.remove("auto");
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

    my$("#cPriceToken").addEventListener("input", function() {
        calcPriceRatio("c");
        calculate();
    });
    my$("#cPriceDFI").addEventListener("input", function() {
        calcPriceRatio("c");
        calculate();
    });
    my$("#cPriceRatio").addEventListener("input", function() {
        priceRatio("c");
        calculate();
    });

    my$("#cAmountDFI").addEventListener("input", function() {
        calculate();
    });
    
    my$("#fPriceToken").addEventListener("input", function() {
        calcPriceRatio("f");
        calculate();
    });
    my$("#fPriceDFI").addEventListener("input", function() {
        calcPriceRatio("f");
        calculate();
    });
    my$("#fPriceRatio").addEventListener("input", function() {
        priceRatio("f");
        calculate();
    });

    my$("#apr").addEventListener("input", function() {
        calculate();
    });
    my$("#fee").addEventListener("input", function() {
        calculate();
    });
    my$("#duration").addEventListener("input", function() {
        calculate();
    });
    my$("#period").addEventListener("input", function() {
        calculate();
    });
    my$("#period").addEventListener("input", function() {
        calculate();
    });

    my$("#sync").addEventListener("click", function() {
        getPrices();
    });

    createEmptyPlot();

    $(document).keydown(function(e) {
        if (e.which == 27) {
        $('body').chardinJs('stop');
        return false;
        }
    });

    my$("#play").addEventListener("mouseover", function() {
        my$("#play").style.display = "none";
        my$("#play2").style.display = "block";
    });
    my$("#play").addEventListener("mouseout", function() {
        my$("#play").style.display = "block";
        my$("#play2").style.display = "none";
    });
    my$("#playButtons").addEventListener("click", function() {
        startTutorial();
    });
    if ( localStorage.getItem("Tutorial") != "Started") {
        startTutorial();
    }
});

function SwitchTokenLabel() {
    var label = my$("#OtherTokenValue").value;
    myMap("[name='OtherToken']", function(el) {
        el.innerHTML = coinNameToImg(label);
    });
    myMap("[name='OtherRatio']", function(el) {
        el.innerHTML = coinNameToImg(label);
    });
}

function formatCoin(coin) {
    if (!coin.id) {
        return coin.text;
    }

    var $coin = $(coinNameToImg(coin.id));
    return $coin;
}

function coinNameToImg(coinName) {
    return '<img src="img/' + coinName + '.svg" class="img-flag"/>&nbsp;';
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
        } /*else if ($("#OtherTokenValue").val() == "USDT") {
            $(priceRatio).prop("disabled", false);
            $(priceRatio).parent().removeClass("auto");
        }*/
    } /*else {
        $(priceRatio).prop("disabled", false);
        $(priceRatio).parent().removeClass("auto");
    }*/
    if (!$(priceDFI).prop("disabled") && !$(priceDFI).prop("disabled")) {
        $(priceRatio).val("");
    }
}

function startTutorial() {
    $('body').chardinJs('start');
    localStorage.setItem("Tutorial", "Started");
}

function compareValues(value1, value2, id1, id2) {
    // clear previous results
    $(id2).parent().children().first().removeClass("minus");
    $(id2).parent().children().first().removeClass("plus");

    if ((value1 == value2) || (value1 == 0) || (value2 == 0)){
        return;
    }
    else if (value1 > value2) {
        $(id2).parent().children().first().addClass("minus");
    } else {
        $(id2).parent().children().first().addClass("plus");
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

    $("#int").prop("hidden", true);
    createEmptyPlot();

    if ((($("#cPriceToken").val() && $("#cPriceDFI").val()) ||
         ($("#cPriceRatio").val())) &&
        ($("#cAmountDFI").val())) {
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
                var cPeriod  = +$("#period").val();
                var duration = +$("#duration").val();
                var compAPR  = apr / 100;
                var compFee  = fee / 100;
                var periods  = 0;

                if (cPeriod && (cPeriod < duration)) {
                    if (cPeriod < (1 / 2880))
                        cPeriod = (1 / 2880);
                    var convFee = 0.0001;

                    periods  = 365 / cPeriod;
                    compAPR  = Math.pow( 1 + (compAPR * (1 - convFee) / periods), periods) - 1;
                    compFee  = Math.pow( 1 + (compFee * (1 - convFee) / periods), periods) - 1;

                    var transFee = 0.0001634;
                    // 2 transaction fees (one to convert, one to pool) + 1 convertion fee per period
                    fAmountDFII   = fAmountDFI + (((fAmountDFI * (compAPR + compFee)) - (2 * transFee * periods)) * duration / 365);
                    fAmountTokenI = fAmountToken + (fAmountToken * (compAPR + compFee) * duration / 365);
                } else {
                    fAmountDFII   = fAmountDFI + ((fAmountDFI * ( 2 * compAPR + compFee)) * duration / 365);
                    fAmountTokenI = fAmountToken + (fAmountToken * compFee * duration / 365);
                }

                fValueTokenI  = fAmountTokenI * fPriceToken;
                fValueDFII    = fAmountDFII * fPriceDFI;
                fValueI       = fValueTokenI + fValueDFII;
            }

            createPlot(cPriceRatio, fPriceRatio, fValue, fValueI, fValueH);
        }
    }

    $("#cAmountToken").val(prettyNumber(cAmountToken));
    $("#cValueToken").val(prettyNumber(cValueToken));
    $("#cValueDFI").val(prettyNumber(cValueDFI));
    $("#cValue").val(prettyNumber(cValue));

    $("#fAmountToken").val(prettyNumber(fAmountToken));
    $("#fAmountDFI").val(prettyNumber(fAmountDFI));

    $("#fValueToken").val(prettyNumber(fValueToken));
    $("#fValueDFI").val(prettyNumber(fValueDFI));
    $("#fValue").val(prettyNumber(fValue));

    $("#fValueTokenH").val(prettyNumber(fValueTokenH));
    $("#fValueDFIH").val(prettyNumber(fValueDFIH));
    $("#fValueH").val(prettyNumber(fValueH));

    compareValues(fValueDFIH, fValueDFI, "#fValueDFIH", "#fValueDFI");
    compareValues(fValueTokenH, fValueToken, "#fValueTokenH", "#fValueToken");
    compareValues(fValueH, fValue, "#fValueH", "#fValue");

    $("#fValueTokenI").val(prettyNumber(fValueTokenI));
    $("#fValueDFII").val(prettyNumber(fValueDFII));
    $("#fValueI").val(prettyNumber(fValueI));

    compareValues(fValueDFIH, fValueDFII, "#fValueDFIH", "#fValueDFII");
    compareValues(fValueTokenH, fValueTokenI, "#fValueTokenH", "#fValueTokenI");
    compareValues(fValueH, fValueI, "#fValueH", "#fValueI");
}

function compareNumbers(a, b) {
    return a - b;
}

function createEmptyPlot() {
    new Chartist.Line(".ct-chart", {
        labels: [0, 25, 50, 100, 125, 150, 175, 200],
        series: [[]]
    }, {
        high: 100,
        low: -100,
        //fullWidth: true,
    });
}
function createPlot(cPriceRatio, fPriceRatio, fValue, fValueI, fValueH) {
    $("#chartTitle").prop("hidden", false);
    $("#chartSubTitle").prop("hidden", false);
    $("#yLabel").prop("hidden", false);
    $("#xLabel").prop("hidden", false);
    $("#noInt").prop("hidden", false);

    var current = Math.round(fPriceRatio/cPriceRatio * 100);

    /* Math:
     * AmountDFI * AmountToken = k
     * PriceRatio = AmountToken / AmountDFI
     * PriceRatio = PriceDFI / PriceToken
     *
     * AmountToken = k / AmountDFI
     * AmountDFI = AmountToken / PriceRatio
     * AmountToken = k / AmountToken / PriceRatio
     * AmountToken^2 = k * PriceRatio
     * AmountToken = sqrt(k * PriceRatio)
     *
     * AmountDFI = k / AmountToken
     * AmountToken = PriceRatio * AmountDFI
     * AmountDFI = k / (PriceRatio * AmountDFI)
     * AmountDFI^2 = k / PriceRatio
     * AmountDFI = sqrt(k / PriceRatio)
     *
     * divergenceLoss = (fValue - fValueH) / fValue
     * divergenceLoss = (fValue / fValueH) - 1
     * divergenceLoss = (2 * fAmountDFI) / (cAmountDFI + (cAmountToken * fPriceRatio)) -1
     * divergenceLoss = (2 * sqrt(k/fPriceRatio)) / (sqrt(k/cPriceRatio) + (sqrt(k*cPriceRatio)/fPriceRatio)) - 1
     * divergenceLoss = (2 * sqrt(1/fPriceRatio)) / (sqrt(1/cPriceRatio) + (sqrt(cPriceRatio)/fPriceRatio)) - 1
     * divergenceLoss = (2 * sqrt(1/fPriceRatio)) / (1 * sqrt(1/cPriceRatio) + (cPriceRatio/fPriceRatio * sqrt(1/cPriceRatio))) - 1
     * divergenceLoss = (2 * sqrt(1/fPriceRatio)) / (1 * sqrt(1/cPriceRatio) * (1 + cPriceRatio/fPriceRatio))) - 1
     * divergenceLoss = (2 * sqrt(cPriceRatio/fPriceRatio) * 1/(1 + cPriceRatio/fPriceRatio)) - 1
     * divergenceLoss = (2 * sqrt(cPriceRatio/fPriceRatio)/(1 + cPriceRatio/fPriceRatio)) - 1
     * divergenceLoss = (2 * (fPriceRatio/cPriceRatio * sqrt(cPriceRatio/fPriceRatio))/(fPriceRatio/cPriceRatio * (1 + cPriceRatio/fPriceRatio))) - 1
     * divergenceLoss = (2 * sqrt(fPriceRatio/cPriceRatio) / (fPriceRatio/cPriceRatio + 1)) -1
    */

    priceRatios = [];
    points      = [];
    points2     = [];

    if (current < 500) {
        for (let i = 0; i < 11; i++) {
            priceRatios.push(50 * i);
        }
    } else {
        var step = Math.round(2 * current / 11);
        for (let i = 0; i < 11; i++) {
            priceRatios.push(step * i);
        }
        priceRatios.push(current);
    }
    priceRatios.push(current);
    priceRatios = [...new Set(priceRatios)].sort(compareNumbers);

    for (let i = 0; i < priceRatios.length; i++) {
        points.push(100 * ((2 * Math.sqrt(priceRatios[i] / 100) / (1 + (priceRatios[i] / 100))) - 1));
    }
    if (fValueI) {
        $("#int").prop("hidden", false);
        interest_ratio = fValueI / fValue;
        for (let i = 0; i < priceRatios.length; i++) {
            points2.push(100 * ((2 * interest_ratio * Math.sqrt(priceRatios[i] / 100) / (1 + (priceRatios[i] / 100))) - 1));
        }
    }

    priceRatios[priceRatios.indexOf(current)] = current + " (current)";
    new Chartist.Line(".ct-chart", {
        labels: priceRatios,
        series: [points, points2]
    }, {
        high: Math.max.apply(null, points.concat(points2)),
        low: -100,
        showArea: true,
        //fullWidth: true,
        plugins: [
            Chartist.plugins.ctThreshold({
                threshold: 0
            })
        ]
    });
}

function getPrices() {
    // showing loading
    my$("#sync").classList.add("rotate");
    var defichain = "defichain"
    var otherCoin = my$("#OtherTokenValue").options[my$("#OtherTokenValue").selectedIndex].innerHTML.toLowerCase();
    var currency  = "usd"
    var url = "https://api.coingecko.com/api/v3/simple/price?ids=" + defichain + "%2C" + otherCoin + "&vs_currencies=" + currency;
    fetch(url)
    .then((response) => response.json())
    .then(function(data){
        my$("#cPriceDFI").value = data[defichain].usd;
        inputEvent("#cPriceDFI");
        if (otherCoin != "tether") {
            my$("#cPriceToken").value = data[otherCoin].usd;
            inputEvent("#cPriceToken");
        }
        // hiding loading
        my$("#sync").classList.remove("rotate");
    })
    .catch(function(error) {
        // hiding loading
        my$("#sync").classList.remove("rotate");
    });
}

function inputEvent(selector) {
    my$(selector).dispatchEvent(new Event('input'));
}

function myMap(selector, func) {
    return Array.prototype.map.call(document.querySelectorAll(selector), func);
}

function my$(selector) {
    return document.querySelector(selector);
}

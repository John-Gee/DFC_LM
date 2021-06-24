document.addEventListener('DOMContentLoaded', function() {
	my$("#OtherTokenValue").addEventListener("input", function() {
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

    if (my$(priceRatio).value ) {
        my$(priceDFI).disabled = true;
        my$(priceDFI).parentElement.classList.add("auto");
        my$(priceToken).disabled = true;
        my$(priceToken).parentElement.classList.add("auto");
    } else {
        my$(priceDFI).disabled = false;
        my$(priceDFI).parentElement.classList.remove("auto");
        my$(priceToken).disabled = false;
        my$(priceToken).parentElement.classList.remove("auto");
    }
}

function calcPriceRatio(time) {
    var priceToken = "#" + time + "PriceToken";
    var priceDFI   = "#" + time + "PriceDFI";
    var priceRatio = "#" + time + "PriceRatio";

    if (my$(priceToken).value || my$(priceDFI).value) {
        my$(priceRatio).disabled = true;
        my$(priceRatio).parentElement.classList.add("auto");

        if (my$(priceToken).value && my$(priceDFI).value) {
            my$(priceRatio).value = prettyNumber(my$(priceToken).value / my$(priceDFI).value);
            return
        } /*else if (my$("#OtherTokenValue").value == "USDT") {
            my$(priceRatio).disabled = false;
            my$(priceRatio).parentElement.classList.remove("auto");
        }*/
    } /*else {
        my$(priceRatio).disabled = false;
        my$(priceRatio).parentElement.classList.remove("auto");
    }*/
    if (!my$(priceDFI).disabled && !my$(priceDFI).disabled) {
        my$(priceRatio).value = "";
    }
}

function startTutorial() {
    $('body').chardinJs('start');
    localStorage.setItem("Tutorial", "Started");
}

function compareValues(value1, value2, id1, id2) {
    // clear previous results
    my$(id2).parentElement.firstElementChild.classList.remove("minus");
    my$(id2).parentElement.firstElementChild.classList.remove("plus");

    if ((value1 == value2) || (value1 == 0) || (value2 == 0)){
        return;
    }
    else if (value1 > value2) {
        my$(id2).parentElement.firstElementChild.classList.add("minus");
    } else {
        my$(id2).parentElement.firstElementChild.classList.add("plus");
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

    my$("#int").hidden = true;
    createEmptyPlot();

    if (((my$("#cPriceToken").value && my$("#cPriceDFI").value) ||
         (my$("#cPriceRatio").value)) &&
        (my$("#cAmountDFI").value)) {
        var cPriceRatio  = 0;
        cAmountDFI   = +my$("#cAmountDFI").value;

        if (my$("#cPriceToken").value && my$("#cPriceDFI").value) {
            cPriceToken  = +my$("#cPriceToken").value;
            cPriceDFI    = +my$("#cPriceDFI").value;
            cPriceRatio  = cPriceToken / cPriceDFI;
        } else if (my$("#cPriceRatio").value) {
            cPriceRatio  = +my$("#cPriceRatio").value;
        }

        cAmountToken = cAmountDFI/cPriceRatio;
        cValueToken  = cAmountToken * cPriceToken;
        cValueDFI    = cAmountDFI * cPriceDFI;
        cValue       = cValueToken + cValueDFI;

        var fPriceToken  = +my$("#fPriceToken").value;
        var fPriceDFI    = +my$("#fPriceDFI").value;
        var fPriceRatio  = +my$("#fPriceRatio").value;

        if (my$("#fPriceToken").value && my$("#fPriceDFI").value) {

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

            if ((my$("#apr").value || my$("#fee").value) && my$("#duration").value ) {
                var apr      = +my$("#apr").value;
                var fee      = +my$("#fee").value;
                var cPeriod  = +my$("#period").value;
                var duration = +my$("#duration").value;
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

    my$("#cAmountToken").value = prettyNumber(cAmountToken);
    my$("#cValueToken").value = prettyNumber(cValueToken);
    my$("#cValueDFI").value = prettyNumber(cValueDFI);
    my$("#cValue").value = prettyNumber(cValue);

    my$("#fAmountToken").value = prettyNumber(fAmountToken);
    my$("#fAmountDFI").value = prettyNumber(fAmountDFI);

    my$("#fValueToken").value = prettyNumber(fValueToken);
    my$("#fValueDFI").value = prettyNumber(fValueDFI);
    my$("#fValue").value = prettyNumber(fValue);

    my$("#fValueTokenH").value = prettyNumber(fValueTokenH);
    my$("#fValueDFIH").value = prettyNumber(fValueDFIH);
    my$("#fValueH").value = prettyNumber(fValueH);

    compareValues(fValueDFIH, fValueDFI, "#fValueDFIH", "#fValueDFI");
    compareValues(fValueTokenH, fValueToken, "#fValueTokenH", "#fValueToken");
    compareValues(fValueH, fValue, "#fValueH", "#fValue");

    my$("#fValueTokenI").value = prettyNumber(fValueTokenI);
    my$("#fValueDFII").value = prettyNumber(fValueDFII);
    my$("#fValueI").value = prettyNumber(fValueI);

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
        my$("#int").hidden = false;
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

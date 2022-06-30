/*function removeAccents(obj) {
    return obj.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}*/

function clearCPriceFirstToken() {
    if ((my$("#CurrencyValue").value == "usd") && (my$("#FirstTokenValue").value == "dUSD")) {
        my$("#cPriceFirstToken").value = 1;
        inputEvent("#cPriceFirstToken");
        my$("#cPriceFirstToken").disabled = true;
        my$("#cPriceFirstToken").parentElement.classList.add("auto");
        my$("#fPriceFirstToken").value = 1;
        inputEvent("#fPriceFirstToken");
        my$("#fPriceFirstToken").disabled = true;
        my$("#fPriceFirstToken").parentElement.classList.add("auto");
    } else {
        my$("#cPriceFirstToken").value = "";
        inputEvent("#cPriceFirstToken");
        my$("#cPriceFirstToken").disabled = false;
        my$("#cPriceFirstToken").parentElement.classList.remove("auto");
        my$("#fPriceFirstToken").value = "";
        inputEvent("#fPriceFirstToken");
        my$("#fPriceFirstToken").disabled = false;
        my$("#fPriceFirstToken").parentElement.classList.remove("auto");
    }
}

function clearCPriceOtherToken() {
    if (((my$("#CurrencyValue").value == "usd") && ((my$("#OtherTokenValue").value == "dUSDC") || (my$("#OtherTokenValue").value == "dUSDT"))) ||
        ((my$("#CurrencyValue").value == "btc") && (my$("#OtherTokenValue").value == "dBTC")) ||
        ((my$("#CurrencyValue").value == "eth") && (my$("#OtherTokenValue").value == "dETH"))) {
        my$("#cPriceOtherToken").value = 1;
        inputEvent("#cPriceOtherToken");
        my$("#cPriceOtherToken").disabled = true;
        my$("#cPriceOtherToken").parentElement.classList.add("auto");
        my$("#fPriceOtherToken").value = 1;
        inputEvent("#fPriceOtherToken");
        my$("#fPriceOtherToken").disabled = true;
        my$("#fPriceOtherToken").parentElement.classList.add("auto");
    } else if ((my$("#CurrencyValue").value == "bits") && (my$("#OtherTokenValue").value == "BTC")) {
        my$("#cPriceOtherToken").value = 1000000;
        inputEvent("#cPriceOtherToken");
        my$("#cPriceOtherToken").disabled = true;
        my$("#cPriceOtherToken").parentElement.classList.add("auto");
        my$("#fPriceOtherToken").value = 1000000;
        inputEvent("#fPriceOtherToken");
        my$("#fPriceOtherToken").disabled = true;
        my$("#fPriceOtherToken").parentElement.classList.add("auto");
    } else if ((my$("#CurrencyValue").value == "sats") && (my$("#OtherTokenValue").value == "BTC")) {
        my$("#cPriceOtherToken").value = 100000000;
        inputEvent("#cPriceOtherToken");
        my$("#cPriceOtherToken").disabled = true;
        my$("#cPriceOtherToken").parentElement.classList.add("auto");
        my$("#fPriceOtherToken").value = 100000000;
        inputEvent("#fPriceOtherToken");
        my$("#fPriceOtherToken").disabled = true;
        my$("#fPriceOtherToken").parentElement.classList.add("auto");
    } else {
        my$("#cPriceOtherToken").value = "";
        inputEvent("#cPriceOtherToken");
        my$("#fPriceOtherToken").value = "";
        inputEvent("#fPriceOtherToken");
        if (!my$("#cPriceFirstToken").disabled) {
            my$("#cPriceOtherToken").disabled = false;
            my$("#cPriceOtherToken").parentElement.classList.remove("auto");
        }
        if (!my$("#fPriceFirstToken").disabled) {
            my$("#fPriceOtherToken").disabled = false;
            my$("#fPriceOtherToken").parentElement.classList.remove("auto");
        }
    }
}

function clearCPriceDFI() {
    my$("#cPriceDFI").value = "";
    inputEvent("#cPriceDFI");
    my$("#fPriceDFI").value = "";
    inputEvent("#fPriceDFI");
}

function SwitchCurrencyLabel() {
    const label = my$("#CurrencyValue").options[my$("#CurrencyValue").selectedIndex].innerHTML;
    myMap("[name='Currency']", function(el) {
        el.innerHTML = label;
    });
    localStorage.setItem("Currency", my$("#CurrencyValue").selectedIndex);
}

function SwitchFirstTokenLabel() {
    const label = my$("#FirstTokenValue").value;
    myMap("[name='FirstToken']", function(el) {
        el.innerHTML = coinNameToImg(label);
    });
    myMap("[name='FirstRatio']", function(el) {
        el.innerHTML = coinNameToImg(label);
    });
    my$("#xLabel").children[3].innerHTML = label;
    localStorage.setItem("FirstToken", my$("#FirstTokenValue").selectedIndex);
}

function SwitchOtherTokenLabel() {
    const label = my$("#OtherTokenValue").value;
    myMap("[name='OtherToken']", function(el) {
        el.innerHTML = coinNameToImg(label);
    });
    myMap("[name='OtherRatio']", function(el) {
        el.innerHTML = coinNameToImg(label);
    });
    my$("#xLabel").children[1].innerHTML = label;
    localStorage.setItem("OtherToken", my$("#OtherTokenValue").selectedIndex);
}

function formatCoin(coin, container) {
    if(coin.element) {
        if(coin.element.className) {
            container.classList.add(coin.element.className);
        }
    }

    if (!coin.id) {
        return coin.text;
    }

    const img = document.createElement("img");
    img.src = "../docs/img/" + coin.id + ".svg";
    img.class = "img-flag";
    return img;
}

function coinNameToImg(coinName) {
    return "<img src='../docs/img/" + coinName + ".svg' class='img-flag' alt='" + coinName + "'/>";
}

function prettyNumber(number) {
    if (number == "")
        return "";

    return numbro(number).format({
        /*average: true,
        totalLength: 10,*/
        optionalMantissa: true,
        thousandSeparated: true,
        trimMantissa: true
    });
}

function prettyNumberCleaner(number) {
    return numbro(number).format({
        /*average: true,
        totalLength: 10,*/
        optionalMantissa: true,
        thousandSeparated: true,
        trimMantissa: true,
        mantissa: 2
    });
}

function cCalculate() {
    xCalculate("c");
}

function fCalculate() {
    xCalculate("f");
}

function xCalculate(letter) {
    calcPriceRatio(letter);
    calculate();
}

function calcPriceRatio(time) {
    const priceToken      = "#" + time + "PriceOtherToken";
    const priceFirstToken = "#" + time + "PriceFirstToken";
    const priceRatio      = "#" + time + "PriceRatio";

    if (!my$(priceFirstToken).value || !my$(priceToken).value)
        my$(priceRatio).value = "";
    else
        my$(priceRatio).value = prettyNumber(my$(priceToken).value / my$(priceFirstToken).value);
}

function createTutorial() {
    const pricesPosition    = "right";
    let   interestsPosition = "top";
    let   lmaPosition       = "right";
    let   valuesLPosition   = "left";
    let   valuesRPosition   = "left";

    const mediaQuery = window.matchMedia("(max-width: 900px)");
    if (mediaQuery.matches) {
        interestsPosition = "left";
        lmaPosition       = "top";
        valuesLPosition   = "right";
        valuesRPosition   = "left";
    }

    const lang = getLanguageObj();
    return [
        {
            element: "#play",
            title: lang["tour"]["play"]
        },
        {
            element: "#infoB",
            title: lang["tour"]["infoB"]
        },
        {
            title: lang["tour"]["title"]
        },
        {
            element: "#CurrencyValueDiv",
            title: lang["tour"]["CurrencyValueDiv"],
            position: pricesPosition
        },
        {
            element: "#FirstTokenValueDiv",
            title: lang["tour"]["FirstTokenValueDiv"],
            position: pricesPosition
        },
        {
            element: "#OtherTokenValueDiv",
            title: lang["tour"]["OtherTokenValueDiv"],
            position: pricesPosition
        },
        {
            element: "#sync",
            title: lang["tour"]["sync"],
            position: pricesPosition
        },
        {
            element: "#cPriceFirstTokenDiv",
            title: lang["tour"]["cPriceFirstTokenDiv"],
            position: pricesPosition
        },
        {
            element: "#cPriceOtherTokenDiv",
            title: lang["tour"]["cPriceOtherTokenDiv"],
            position: pricesPosition
        },
        {
            element: "#cPriceRatioDiv",
            title: lang["tour"]["cPriceRatioDiv"],
            position: pricesPosition
        },
        {
            element: "#fPriceFirstTokenDiv",
            title: lang["tour"]["fPriceFirstTokenDiv"],
            position: pricesPosition
        },
        {
            element: "#fPriceOtherTokenDiv",
            title: lang["tour"]["fPriceOtherTokenDiv"],
            position: pricesPosition
        },
        {
            element: "#cAmountFirstTokenDiv",
            title: lang["tour"]["cAmountFirstTokenDiv"],
            position: interestsPosition
        },
        {
            element: "#cAmountOtherTokenDiv",
            title: lang["tour"]["cAmountOtherTokenDiv"],
            position: interestsPosition
        },
        {
            element: "#interestH",
            title: lang["tour"]["interestH"],
            position: interestsPosition
        },
        {
            element: "#aprDiv",
            title: lang["tour"]["aprDiv"],
            position: interestsPosition
        },
        {
            element: "#feeDiv",
            title: lang["tour"]["feeDiv"],
            position: interestsPosition
        },
        {
            element: "#durationDiv",
            title: lang["tour"]["durationDiv"],
            position: interestsPosition
        },
        {
            element: "#periodDiv",
            title: lang["tour"]["periodDiv"],
            position: interestsPosition
        },
        {
            element: "#taxDiv",
            title: lang["tour"]["taxDiv"],
            position: interestsPosition
        },
        {
            element: "#LMA",
            title: lang["tour"]["LMA"],
            position: lmaPosition
        },
        {
            element: "#IV",
            title: lang["tour"]["IV"],
            position: valuesLPosition
        },
        {
            element: "#HV",
            title: lang["tour"]["HV"],
            position: valuesRPosition
        },
        {
            element: "#HV1",
            title: lang["tour"]["HV1"],
            position: valuesRPosition
        },
        {
            element: "#LMV",
            title: lang["tour"]["LMV"],
            position: valuesLPosition
        },
        {
            element: "#LMIV",
            title: lang["tour"]["LMIV"],
            position: valuesRPosition
        },
        {
            element: "#plot",
            title: lang["tour"]["plot"],
            position: "top"
        },
        {
            element: "#urlB",
            title: lang["tour"]["urlB"]
        }
    ];
}

function startTutorial() {
    const startT = function() {
        const step = localStorage.getItem("Tutorial-N");
        if (step)
            guideChimp.start(step);
        else
            guideChimp.start();
        localStorage.setItem("Tutorial", "Started");
    };

    if (guideChimp === null)
        setupGuide(startT);
    else
        startT();
}

function setupGuide(func) {
    lazyLoadStyle("../docs/Libraries/GuideChimp/guidechimp.min.css");
    lazyLoadStyle("css/guide.css");
    lazyLoadScript("../docs/Libraries/GuideChimp/guidechimp.min.js", () => {
        guideChimp = GuideChimp(createTutorial(), {padding: 5});
        guideChimp.on("onStop", ()=>{
            localStorage.setItem("Tutorial-N", guideChimp.currentStepIndex);
        });
        guideChimp.on("onComplete", ()=>{
            localStorage.removeItem("Tutorial-N");
        });
        func();
    });
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

function compareTotalValues(cValue, fValueH, fValueHDFI, fValueHToken, fValue, fValueI) {
    if (!fValue)
        return;

    let best    = "c";
    let biggest = cValue;

    if (cValue < fValueH) {
        best    = "fh";
        biggest = fValueH;
    }

    if (biggest < fValueHDFI) {
        best    = "fhT1";
        biggest = fValueHDFI;
    }

    if (biggest < fValueHToken) {
        best    = "fhT2";
        biggest = fValueHToken;
    }

    if (biggest < fValue) {
        best    = "f";
        biggest = fValue;
    }

    if (biggest < fValueI) {
        best    = "fi";
        biggest = fValueI;
    }

    if (biggest) {
        my$("#best").classList.add("best-" + best);
        if ((best == "fhT1") || (best == "fhT2"))
            my$("#best1").classList.add("best-fh1");
    }
}

function calculate() {
    let cPriceFirstToken            = 0;
    let cPriceOtherToken            = 0;

    let cAmountFirstToken           = 0;
    let cAmountOtherToken           = 0;

    let cValueFirstToken            = 0;
    let cValueOtherToken            = 0;
    let cValue                      = 0;

    let fAmountFirstToken           = 0;
    let fAmountOtherToken           = 0;

    let fAmountFirstTokenI          = 0;
    let fAmountOtherTokenI          = 0;
    let fAmountDFII                 = 0;

    let fValueFirstToken            = 0;
    let fValueOtherToken            = 0;
    let fValue                      = 0;

    let fValueFirstTokenI           = 0;
    let fValueOtherTokenI           = 0;
    let fValueDFII                  = 0;
    let fValueI                     = 0;

    let fValueFirstTokenH           = 0;
    let fValueOtherTokenH           = 0;
    let fValueH                     = 0;

    let fValueFirstTokenHFirstToken = 0;
    let fValueOtherTokenHOtherToken = 0;

    // should prevent multiple rendering while updating values
    let origCalcDisplay = my$("#calc").style.display;
    my$("#calc").style.display = "none";

    my$("#best").className  = "";
    my$("#best1").className = "";

    runOnChildren("#amountsParent > div", function(el) {
        el.classList.add("shadow");
    });
    runOnChildren("#values > div", function(el) {
        el.classList.add("shadow");
    });
    my$("#valuesTitles3").classList.remove("shadow");

    runOnChildren("#fAmounts > div", function(el) {
        el.dataset.tooltip = "";
    });
    runOnChildren("#fAmountsI > div", function(el) {
        el.dataset.tooltip = "";
    });

    runOnChildren("#mining > div", function(el) {
        el.dataset.tooltip = "";
    });
    runOnChildren("#miningI > div", function(el) {
        el.dataset.tooltip = "";
    });

    my$("#int").hidden = true;
    createEmptyPlot();

    if (((my$("#cPriceOtherToken").value && my$("#cPriceFirstToken").value) ||
         (my$("#cPriceRatio").value)) &&
        (my$("#cAmountFirstToken").value)) {
        let cPriceRatio   = 0;
        cAmountFirstToken = +my$("#cAmountFirstToken").value;

        if (my$("#cPriceOtherToken").value && my$("#cPriceFirstToken").value) {
            cPriceOtherToken = +my$("#cPriceOtherToken").value;
            cPriceFirstToken = +my$("#cPriceFirstToken").value;
            cPriceRatio      = cPriceOtherToken / cPriceFirstToken;
        } else if (my$("#cPriceRatio").value) {
            cPriceRatio      = +my$("#cPriceRatio").value;
        }

        cAmountOtherToken = cAmountFirstToken/cPriceRatio;
        cValueOtherToken  = cAmountOtherToken * cPriceOtherToken;
        cValueFirstToken  = cAmountFirstToken * cPriceFirstToken;
        cValue            = cValueOtherToken + cValueFirstToken;

        const fPriceOtherToken = +my$("#fPriceOtherToken").value;
        const fPriceFirstToken = +my$("#fPriceFirstToken").value;
        const fPriceDFI        = +my$("#fPriceDFI").value;
        let   fPriceRatio      = +my$("#fPriceRatio").value;

        if (my$("#fPriceOtherToken").value && my$("#fPriceFirstToken").value) {

            fPriceRatio  = fPriceOtherToken / fPriceFirstToken;

            if ((fPriceFirstToken == cPriceFirstToken) && (fPriceOtherToken == cPriceOtherToken)) {
                fAmountFirstToken = cAmountFirstToken;
                fAmountOtherToken = cAmountOtherToken;
            }
        }

        my$("#initialValues").classList.remove("shadow");

        if (fPriceRatio) {
            /* The ratio of tokens in the pool
            is the same as the ratio of prices
            cPriceFirstToken / cPriceOtherToken = cAmountOtherToken / cAmountFirstToken
            fPriceFirstToken / fPriceOtherToken = fAmountOtherToken / fAmountFirstToken

            AND

            Per the constant product formula x * y = k
            cAmountOtherToken * cAmountFirstToken = k
            and
            fAmountOtherToken * fAmountFirstToken = k
            hence
            cAmountOtherToken * cAmountFirstToken = fAmountOtherToken * fAmountFirstToken

            So
            fAmountOtherToken = cAmountOtherToken * cAmountFirstToken / fAmountFirstToken
            fAmountFirstToken = (fPriceOtherToken / fPriceFirstToken) * fAmountOtherToken
            fAmountOtherToken = cAmountOtherToken * cAmountFirstToken / ((fPriceOtherToken / fPriceFirstToken) * fAmountOtherToken)
            fAmountOtherToken = cAmountOtherToken * cAmountFirstToken / ((fPriceOtherToken * fAmountOtherToken) / fPriceFirstToken)
            fAmountOtherToken = cAmountOtherToken * cAmountFirstToken * fPriceFirstToken / (fPriceOtherToken * fAmountOtherToken)
            fAmountOtherToken^2 = cAmountOtherToken * cAmountFirstToken * fPriceFirstToken / fPriceOtherToken
            fAmountOtherToken = sqrt(cAmountOtherToken * cAmountFirstToken * fPriceFirstToken / fPriceOtherToken) */

            if ((!fAmountOtherToken) && (!fAmountFirstToken)) {
                fAmountOtherToken = Math.sqrt(cAmountOtherToken * cAmountFirstToken * 1/fPriceRatio);
                fAmountFirstToken = (fPriceRatio * fAmountOtherToken);
            }
            addDiffToolTip("#fAmountFirstToken", fAmountFirstToken, cAmountFirstToken);
            addDiffToolTip("#fAmountOtherToken", fAmountOtherToken, cAmountOtherToken);

            fValueOtherToken  = fAmountOtherToken * fPriceOtherToken;
            fValueFirstToken  = fAmountFirstToken * fPriceFirstToken;
            fValue            = fValueOtherToken  + fValueFirstToken;

            fValueOtherTokenH = cAmountOtherToken * fPriceOtherToken;
            fValueFirstTokenH = cAmountFirstToken * fPriceFirstToken;
            fValueH           = fValueOtherTokenH + fValueFirstTokenH;
            
            fValueFirstTokenHFirstToken = 2 * cAmountFirstToken * fPriceFirstToken;
            fValueOtherTokenHOtherToken = 2 * cAmountOtherToken * fPriceOtherToken;

            addDiffToolTip("#fValueFirstToken", fValueFirstToken, fValueFirstTokenH);
            addDiffToolTip("#fValueOtherToken", fValueOtherToken, fValueOtherTokenH);
            addDiffToolTip("#fValue", fValue, fValueH);

            my$("#fAmounts").classList.remove("shadow");
            my$("#holding").classList.remove("shadow");
            my$("#holding1").classList.remove("shadow");
            my$("#mining").classList.remove("shadow");

            if ((my$("#apr").value > 0 || my$("#fee").value > 0) && (my$("#duration").value && my$("#duration").value > 0) ) {
                let   cPeriod  = +my$("#period").value;
                const duration = +my$("#duration").value;
                const apr      = +my$("#apr").value / 100;
                const fee      = +my$("#fee").value / 100;
                let   tax      = +my$("#tax").value / 100;

                if (tax > 1) {
                    alert("Tax cannot be bigger than 100%!");
                    tax = 1;
                }

                /* Fees */
                const convFee  = 0.002;
                const transFee = 0.0001634;

                let periods   = 0;
                let rDuration = duration;
                let compAPR   = 0;
                let compFee   = 0;

                if (cPeriod && (cPeriod <= duration)) {
                    if (cPeriod < (1 / 2880))
                        cPeriod = (1 / 2880);

                    /* From https://www.educba.com/compounding-formula/ */
                    periods  = Math.floor(duration / cPeriod);
                    const periodsY = 365 / cPeriod;
                    const sDuration = periods * cPeriod;
                    rDuration = duration - sDuration;
                    compAPR = Math.pow(1 + (apr * (1 - convFee) / periodsY), periodsY * sDuration / 365) - 1;
                    compFee = Math.pow(1 + (fee * (1 - convFee) / periodsY), periodsY * sDuration / 365) - 1;
                }

                // 2 transaction fees (one to convert, one to pool) + 1 convertion fee per period
                fAmountFirstTokenI = fAmountFirstToken * (1 + compAPR + compFee + (fee * rDuration / 365));
                fAmountOtherTokenI = fAmountOtherToken * (1 + compAPR + compFee + (fee * rDuration / 365));
                if (my$("#FirstTokenValue").value == "DFI") {
                    fAmountFirstTokenI += (fAmountFirstTokenI * 2 * apr * rDuration / 365) - (2 * transFee * periods);
                    if (fAmountFirstTokenI < fAmountFirstToken)
                        fAmountFirstTokenI = fAmountFirstToken;
                }
                else if (my$("#OtherTokenValue").value == "DFI") {
                    fAmountOtherTokenI += (fAmountOtherTokenI * 2 * apr * rDuration / 365) - (2 * transFee * periods);
                    if (fAmountOtherTokenI < fAmountOtherToken)
                        fAmountOtherTokenI = fAmountOtherToken;
                }
                else {
                    fAmountDFII        = (fAmountFirstTokenI * fPriceFirstToken / fPriceDFI * 2 * apr * rDuration / 365) - (2 * transFee * periods);
                    if (fAmountDFII < 0)
                        fAmountDFII = 0;
                }

                /* Taxes */
                if (fAmountFirstTokenI > fAmountFirstToken) {
                    fAmountFirstTokenI -= (fAmountFirstTokenI - fAmountFirstToken) * tax;
                }
                if (fAmountOtherTokenI > fAmountOtherToken) {
                    fAmountOtherTokenI -= (fAmountOtherTokenI - fAmountOtherToken) * tax;
                }

                addDiffToolTip("#fAmountFirstTokenI", fAmountFirstTokenI, cAmountFirstToken);
                addDiffToolTip("#fAmountOtherTokenI", fAmountOtherTokenI, cAmountOtherToken);

                fValueOtherTokenI = fAmountOtherTokenI * fPriceOtherToken;
                fValueFirstTokenI = fAmountFirstTokenI * fPriceFirstToken;
                fValueDFII        = fAmountDFII        * fPriceDFI;
                fValueI           = fValueOtherTokenI  + fValueFirstTokenI + fValueDFII;
                addDiffToolTip("#fValueFirstTokenI", fValueFirstTokenI, fValueFirstTokenH);
                addDiffToolTip("#fValueOtherTokenI", fValueOtherTokenI, fValueOtherTokenH);
                addDiffToolTip("#fValueI", fValueI, fValueH);

                my$("#fAmountsI").classList.remove("shadow");
                my$("#miningI").classList.remove("shadow");
            }

            createPlot(cPriceRatio, fPriceRatio, fValue, fValueI);
        }
    }

    my$("#cAmountOtherToken").value = prettyNumber(cAmountOtherToken);
    my$("#cValueOtherToken").value = prettyNumber(cValueOtherToken);
    my$("#cValueFirstToken").value = prettyNumber(cValueFirstToken);
    my$("#cValue").value = prettyNumber(cValue);

    my$("#fAmountOtherToken").value = prettyNumber(fAmountOtherToken);
    my$("#fAmountFirstToken").value = prettyNumber(fAmountFirstToken);

    my$("#fAmountOtherTokenI").value = prettyNumber(fAmountOtherTokenI);
    my$("#fAmountFirstTokenI").value = prettyNumber(fAmountFirstTokenI);
    my$("#fAmountDFII").value = prettyNumber(fAmountDFII);

    my$("#fValueOtherToken").value = prettyNumber(fValueOtherToken);
    my$("#fValueFirstToken").value = prettyNumber(fValueFirstToken);
    my$("#fValue").value = prettyNumber(fValue);

    my$("#fValueOtherTokenH").value = prettyNumber(fValueOtherTokenH);
    my$("#fValueFirstTokenH").value = prettyNumber(fValueFirstTokenH);
    my$("#fValueH").value = prettyNumber(fValueH);

    my$("#fValueFirstTokenHFirstToken").value = prettyNumber(fValueFirstTokenHFirstToken);
    my$("#fValueOtherTokenHOtherToken").value = prettyNumber(fValueOtherTokenHOtherToken);

    compareValues(fValueFirstTokenH, fValueFirstToken, "#fValueFirstTokenH", "#fValueFirstToken");
    compareValues(fValueOtherTokenH, fValueOtherToken, "#fValueOtherTokenH", "#fValueOtherToken");
    compareValues(fValueH, fValue, "#fValueH", "#fValue");

    my$("#fValueOtherTokenI").value = prettyNumber(fValueOtherTokenI);
    my$("#fValueFirstTokenI").value = prettyNumber(fValueFirstTokenI);
    my$("#fValueDFII").value = prettyNumber(fValueDFII);
    my$("#fValueI").value = prettyNumber(fValueI);

    compareValues(fValueFirstTokenH, fValueFirstTokenI, "#fValueFirstTokenH", "#fValueFirstTokenI");
    compareValues(fValueOtherTokenH, fValueOtherTokenI, "#fValueOtherTokenH", "#fValueOtherTokenI");
    compareValues(fValueH, fValueI, "#fValueH", "#fValueI");

    compareTotalValues(cValue, fValueH, fValueFirstTokenHFirstToken, fValueOtherTokenHOtherToken, fValue, fValueI);

    my$("#calc").style.display = origCalcDisplay;
}

function compareNumbers(a, b) {
    return a - b;
}

function createEmptyPlot() {
    new Chartist.Line(".ct-chart", {
        series: [[],[]]
    });
}

function createPlot(cPriceRatio, fPriceRatio, fValue, fValueI) {
    const current = Math.round(fPriceRatio/cPriceRatio * 100);

    /* Math:
     * AmountFirstToken * AmountOtherToken = k
     * PriceRatio = AmountOtherToken / AmountFirstToken
     * PriceRatio = PriceFirstToken / PriceOtherToken
     *
     * AmountOtherToken = k / AmountFirstToken
     * AmountFirstToken = AmountOtherToken / PriceRatio
     * AmountOtherToken = k / AmountOtherToken / PriceRatio
     * AmountOtherToken^2 = k * PriceRatio
     * AmountOtherToken = sqrt(k * PriceRatio)
     *
     * AmountFirstToken = k / AmountOtherToken
     * AmountOtherToken = PriceRatio * AmountFirstToken
     * AmountFirstToken = k / (PriceRatio * AmountFirstToken)
     * AmountFirstToken^2 = k / PriceRatio
     * AmountFirstToken = sqrt(k / PriceRatio)
     *
     * divergenceLoss = (fValue - fValueH) / fValue
     * divergenceLoss = (fValue / fValueH) - 1
     * divergenceLoss = (2 * fAmountFirstToken) / (cAmountFirstToken + (cAmountOtherToken * fPriceRatio)) -1
     * divergenceLoss = (2 * sqrt(k/fPriceRatio)) / (sqrt(k/cPriceRatio) + (sqrt(k*cPriceRatio)/fPriceRatio)) - 1
     * divergenceLoss = (2 * sqrt(1/fPriceRatio)) / (sqrt(1/cPriceRatio) + (sqrt(cPriceRatio)/fPriceRatio)) - 1
     * divergenceLoss = (2 * sqrt(1/fPriceRatio)) / (1 * sqrt(1/cPriceRatio) + (cPriceRatio/fPriceRatio * sqrt(1/cPriceRatio))) - 1
     * divergenceLoss = (2 * sqrt(1/fPriceRatio)) / (1 * sqrt(1/cPriceRatio) * (1 + cPriceRatio/fPriceRatio))) - 1
     * divergenceLoss = (2 * sqrt(cPriceRatio/fPriceRatio) * 1/(1 + cPriceRatio/fPriceRatio)) - 1
     * divergenceLoss = (2 * sqrt(cPriceRatio/fPriceRatio)/(1 + cPriceRatio/fPriceRatio)) - 1
     * divergenceLoss = (2 * (fPriceRatio/cPriceRatio * sqrt(cPriceRatio/fPriceRatio))/(fPriceRatio/cPriceRatio * (1 + cPriceRatio/fPriceRatio))) - 1
     * divergenceLoss = (2 * sqrt(fPriceRatio/cPriceRatio) / (fPriceRatio/cPriceRatio + 1)) -1
    */

    let priceRatios = [];
    let points      = [];
    let points2     = [];

    let step;
    if (current < 500)
        step = 50;
    else
        step = Math.round(2 * current / 11);
    for (let i = 0; i < 11; i++)
        priceRatios.push(step * i);

    priceRatios.push(current);
    priceRatios = [...new Set(priceRatios)].sort(compareNumbers);

    for (let i = 0; i < priceRatios.length; i++) {
        points.push(100 * ((2 * Math.sqrt(priceRatios[i] / 100) / (1 + (priceRatios[i] / 100))) - 1));
    }
    if (fValueI) {
        my$("#int").hidden = false;
        const interest_ratio = fValueI / fValue;
        for (let i = 0; i < priceRatios.length; i++) {
            points2.push(100 * ((2 * interest_ratio * Math.sqrt(priceRatios[i] / 100) / (1 + (priceRatios[i] / 100))) - 1));
        }
    }

    priceRatios[priceRatios.indexOf(current)] = current + " (from input)";
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

async function getOraclePrice(name) {
    const url   = "https://ocean.defichain.com/v0/mainnet/prices/" + name + "-USD";
    return await fetch(url)
        .then((response) => response.json())
        .then(function(data){
            return data["data"]["price"]["aggregated"]["amount"];
        })
        .catch(function() {
            alert("An error happened while querying the oracle.");
            return 0;
        });
}

async function getCoinGeckoPrice(coin, currency) {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=" + currency;
    return await fetch(url)
        .then((response) => response.json())
        .then(function(data){
            return data[coin][currency];
        })
        .catch(function() {
            alert("An error happened while querying CoinGecko.");
            return 0;
        });
}

async function getCurrencyUSDRatio(currency) {
    const btcUSD   = await getCoinGeckoPrice("bitcoin", "usd");
    if (btcUSD == 0)
        return 0;

    const btcOther = await getCoinGeckoPrice("bitcoin", currency);

    return btcOther / btcUSD;
}

async function getPrices() {
    // showing loading
    my$("#sync").classList.add("rotate");

    let   price1    = 1;
    const otherCoin = my$("#OtherTokenValue").options[my$("#OtherTokenValue").selectedIndex].text;
    if (my$("#FirstTokenValue").value != "dUSD")
        price1 = await getOraclePrice(my$("#FirstTokenValue").options[my$("#FirstTokenValue").selectedIndex].text);

    let   price2   = await getOraclePrice(otherCoin);
    let   ratio    = 1;
    const currency = my$("#CurrencyValue").value;
    if (currency != "usd") {
        ratio = await getCurrencyUSDRatio(currency);
    }

    let price3 = await getOraclePrice("DFI");

    if ( (price1 == 0) || (price2 == 0) || (price3 == 0) || (ratio == 0) ) {
        price1 = "";
        price2 = "";
        price3 = "";
    } else {
        price1 = price1 * ratio;
        price2 = price2 * ratio;
        price3 = price3 * ratio;
    }

    my$("#cPriceFirstToken").value = price1;
    inputEvent("#cPriceFirstToken");
    if (!my$("#cPriceOtherToken").disabled) {
        my$("#cPriceOtherToken").value = price2;
        inputEvent("#cPriceOtherToken");
    }
    my$("#cPriceDFI").value = price3;
    inputEvent("#cPriceDFI");
    my$("#sync").classList.remove("rotate");
}

function addDiffToolTip(selector, fNumber, cNumber) {
    let tip;
    const diff = fNumber - cNumber;

    if (selector.includes("Value"))
        tip = "Compared to Holding Value\n$ ";
    else
        tip = "Compared to the Initial Amount\n";

    if (diff > 0)
        tip = tip + "+";
    tip = tip + prettyNumberCleaner(diff) + "\n% ";
    if (diff > 0)
        tip = tip + "+";
    tip = tip + prettyNumberCleaner(diff / cNumber * 100);
    my$(selector).parentElement.dataset.tooltip = tip;
}

// Returns the dictionary for the language.
function getLanguageObj() {
    return eval(my$("#i18n-toggler").value);
}

function translate() {
    const translator = new Translator({
        detectLanguage: false
    });

    const lang = my$("#i18n-toggler").value;
    translator.add(lang, getLanguageObj()).translatePageTo(lang);

    localStorage.setItem("lang", my$("#i18n-toggler").selectedIndex);
}

function info() {
    if (my$("#calc").style.display == "") {
        my$("#calc").style.display = "none";
        my$("#info").style.display = "grid";
        my$("body").style.gridTemplateAreas = "'head' 'info'";
    }
    else {
        my$("#calc").style.display = "";
        my$("#info").style.display = "none";
        my$("body").style.gridTemplateAreas = "'head' 'calc'";
    }
}

function copyPrices() {
    my$("#fPriceFirstToken").value = my$("#cPriceFirstToken").value;
    my$("#fPriceOtherToken").value = my$("#cPriceOtherToken").value;
    my$("#fPriceDFI").value        = my$("#cPriceDFI").value;
    inputEvent("#fPriceOtherToken");
}

function getTokenDFI() {
    if (my$("#FirstTokenValue").value == "DFI")
        return 0;
    if (my$("#OtherTokenValue").value == "DFI")
        return 1;
    return -1;
}

function isATokenDFI() {
    if (getTokenDFI() >= 0)
        for (const elem of document.getElementsByClassName("third"))
            elem.classList.add("hidden");
    else
        for (const elem of document.getElementsByClassName("third"))
            elem.classList.remove("hidden");
}

function parseURL() {
    const queryString = window.location.search;
    const urlParams   = new URLSearchParams(queryString);

    // OtherToken first allows not calling changeEvent on it
    parseParamIndex(urlParams, "OtherTokenValue");
    parseParamIndex(urlParams, "FirstTokenValue");
    parseParamIndex(urlParams, "CurrencyValue");
    parseParam(urlParams, "cPriceFirstToken");
    parseParam(urlParams, "cPriceOtherToken");
    parseParam(urlParams, "cPriceDFI");
    parseParam(urlParams, "fPriceFirstToken");
    parseParam(urlParams, "fPriceOtherToken");
    parseParam(urlParams, "fPriceDFI");
    parseParam(urlParams, "cAmountFirstToken");
    parseParam(urlParams, "apr");
    parseParam(urlParams, "fee");
    parseParam(urlParams, "duration");
    parseParam(urlParams, "period");
    parseParam(urlParams, "tax");

    return queryString;
}

function parseParam(urlParams, param){
    if (! urlParams.get(param))
        return;
    my$("#" + param).value = urlParams.get(param);
    changeEvent("#" + param);
}

function parseParamIndex(urlParams, param){
    // We need to call changeEvent no matter.
    const p = urlParams.get(param);
    if (p)
        my$("#" + param).selectedIndex = p;
    if (param != "OtherTokenValue")
        changeEvent("#" + param);
}

function share() {
    const url = window.location.href.split("?")[0].concat(
        "?",
        getParamIndex("FirstTokenValue"),
        getParamIndex("CurrencyValue"),
        getParam("cPriceFirstToken"),
        getParamIndex("OtherTokenValue"),
        getParam("cPriceOtherToken"),
        getParam("cPriceDFI"),
        getParam("fPriceFirstToken"),
        getParam("fPriceOtherToken"),
        getParam("fPriceDFI"),
        getParam("cAmountFirstToken"),
        getParam("apr"),
        getParam("fee"),
        getParam("duration"),
        getParam("period"),
        getParam("tax"));
    window.open(url, "_blank");
}

function getParam(param) {
    if (my$("#" + param).value === "")
        return "";
    return param.concat("=", my$("#" + param).value, "&");
}

function getParamIndex(param) {
    if (my$("#" + param).selectedIndex === "")
        return "";
    return param.concat("=", my$("#" + param).selectedIndex, "&");
}

function lazyLoadStyle(path) {
    const lazyLoadedStyle = document.createElement("link");
    lazyLoadedStyle.href  = new URL(path, document.baseURI).href;
    lazyLoadedStyle.rel   = "stylesheet";
    lazyLoadedStyle.type  = "text/css";
    document.head.append(lazyLoadedStyle);
}

function lazyLoadScript(path, func) {
    const lazyLoadedScript = document.createElement("script");
    lazyLoadedScript.src   = new URL(path, document.baseURI).href;
    lazyLoadedScript.async = false;
    document.head.append(lazyLoadedScript);
    lazyLoadedScript.addEventListener("load", () => {
        func();
        document.dispatchEvent(new Event(getFilename(path + "Loaded")));
    });
}

function getFilename(fullPath) {
    return fullPath.substring(fullPath.lastIndexOf("/") + 1);
}

function mousedownEvent(selector) {
    my$(selector).dispatchEvent(new Event("mousedown"));
}

function inputEvent(selector) {
    my$(selector).dispatchEvent(new Event("input"));
}

function changeEvent(selector) {
    my$(selector).dispatchEvent(new Event("change"));
}

function runOnChildren(selector, func) {
    const children = document.querySelectorAll(selector);
    for(let i = 0; i < children.length; ++i) {
        func(children[i]);
    }
}

function myMap(selector, func) {
    return Array.prototype.map.call(document.querySelectorAll(selector), func);
}

function my$(selector) {
    return document.querySelector(selector);
}

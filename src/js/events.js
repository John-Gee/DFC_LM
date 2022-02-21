function setupi18n() {
    new TsSelect2(my$("#i18n-toggler"), {
        minimumResultsForSearch: -1,
        width: "100%",
        dropdownAutoWidth : true,
        templateSelection: removeAccents,
        escapeMarkup: function (m) {
            return m;
        }
    });
    my$("#i18n-toggler").addEventListener("change", function() {
        translate();
        setupGuide();
    });
    if (localStorage.getItem("lang")) {
        my$("#i18n-toggler").selectedIndex = localStorage.getItem("lang");
        changeEvent("#i18n-toggler");
    }
    translate();
}

function setupCurrency() {
    new TsSelect2(my$("#CurrencyValue"), {
        minimumResultsForSearch: -1,
        width: "100%",
        dropdownAutoWidth : true,
        escapeMarkup: function (m) {
            return m;
        }
    });
    my$("#CurrencyValue").addEventListener("change", function() {
        SwitchCurrencyLabel();
        changeEvent("#FirstTokenValue");
        changeEvent("#OtherTokenValue");
    });
    if (localStorage.getItem("Currency")) {
        my$("#CurrencyValue").selectedIndex = localStorage.getItem("Currency");
        changeEvent("#CurrencyValue");
    }
    SwitchCurrencyLabel();
    changeEvent("#FirstTokenValue");
    changeEvent("#OtherTokenValue");
}

function setupFirstToken() {
    new TsSelect2(my$("#FirstTokenValue"), {
        minimumResultsForSearch: -1,
        width: "100%",
        dropdownAutoWidth : true,
        templateResult: formatCoin,
        templateSelection: formatCoin,
        escapeMarkup: function (m) {
            return m;
        }
    });
    my$("#FirstTokenValue").addEventListener("change", function() {
        SwitchFirstTokenLabel();
        if ((my$("#CurrencyValue").value == "usd") && (my$("#FirstTokenValue").value == "dUSD")) {
            my$("#cPriceDFI").value = 1;
            inputEvent("#cPriceDFI");
            my$("#cPriceDFI").disabled = true;
            my$("#cPriceDFI").parentElement.classList.add("auto");
            my$("#fPriceDFI").value = 1;
            inputEvent("#fPriceDFI");
            my$("#fPriceDFI").disabled = true;
            my$("#fPriceDFI").parentElement.classList.add("auto");
        } else {
            my$("#cPriceDFI").value = "";
            inputEvent("#cPriceDFI");
            my$("#cPriceDFI").disabled = false;
            my$("#cPriceDFI").parentElement.classList.remove("auto");
            my$("#fPriceDFI").value = "";
            inputEvent("#fPriceDFI");
            my$("#fPriceDFI").disabled = false;
            my$("#fPriceDFI").parentElement.classList.remove("auto");
        }
        var OtherTokenOptions = my$("#OtherTokenValue");
        var dfiIndex = -1;
        for(var i=0; i < OtherTokenOptions.length; i++) {
            if (OtherTokenOptions[i].value == "DFI") {
                dfiIndex = i;
                break;
            }
        }
        if (my$("#FirstTokenValue").selectedIndex == 0) {
            for(var i=0; i < dfiIndex; i++)
                OtherTokenOptions[i].className = "";
            for(var i=dfiIndex; i < OtherTokenOptions.length; i++)
                OtherTokenOptions[i].className = "optInvisible";
            OtherTokenOptions.selectedIndex = 1;
        } else if (my$("#FirstTokenValue").selectedIndex == 1) {
            for(var i=0; i < dfiIndex; i++)
                OtherTokenOptions[i].className = "optInvisible";
            for(var i=dfiIndex; i < OtherTokenOptions.length; i++)
                OtherTokenOptions[i].className = "";
            OtherTokenOptions.selectedIndex = dfiIndex;
        }
        changeEvent("#OtherTokenValue");
    });
    if (localStorage.getItem("FirstToken")) {
        my$("#FirstTokenValue").selectedIndex = localStorage.getItem("FirstToken");
    }
    SwitchFirstTokenLabel();
    changeEvent("#FirstTokenValue");
}

function setupOtherToken() {
    new TsSelect2(my$("#OtherTokenValue"), {
        minimumResultsForSearch: -1,
        width: "100%",
        dropdownAutoWidth : true,
        templateResult: formatCoin,
        templateSelection: formatCoin,
        escapeMarkup: function (m) {
            return m;
        }
    });
    my$("#OtherTokenValue").addEventListener("change", function() {
        SwitchOtherTokenLabel();
        if (((my$("#CurrencyValue").value == "usd") && ((my$("#OtherTokenValue").value == "USDC") || (my$("#OtherTokenValue").value == "USDT"))) ||
            ((my$("#CurrencyValue").value == "btc") && (my$("#OtherTokenValue").value == "BTC")) ||
            ((my$("#CurrencyValue").value == "eth") && (my$("#OtherTokenValue").value == "ETH"))) {
            my$("#cPriceToken").value = 1;
            inputEvent("#cPriceToken");
            my$("#cPriceToken").disabled = true;
            my$("#cPriceToken").parentElement.classList.add("auto");
            my$("#fPriceToken").value = 1;
            inputEvent("#fPriceToken");
            my$("#fPriceToken").disabled = true;
            my$("#fPriceToken").parentElement.classList.add("auto");
        } else if ((my$("#CurrencyValue").value == "bits") && (my$("#OtherTokenValue").value == "BTC")) {
            my$("#cPriceToken").value = 1000000;
            inputEvent("#cPriceToken");
            my$("#cPriceToken").disabled = true;
            my$("#cPriceToken").parentElement.classList.add("auto");
            my$("#fPriceToken").value = 1000000;
            inputEvent("#fPriceToken");
            my$("#fPriceToken").disabled = true;
            my$("#fPriceToken").parentElement.classList.add("auto");
        } else if ((my$("#CurrencyValue").value == "sats") && (my$("#OtherTokenValue").value == "BTC")) {
            my$("#cPriceToken").value = 100000000;
            inputEvent("#cPriceToken");
            my$("#cPriceToken").disabled = true;
            my$("#cPriceToken").parentElement.classList.add("auto");
            my$("#fPriceToken").value = 100000000;
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
    if (localStorage.getItem("OtherToken")) {
        my$("#OtherTokenValue").selectedIndex = localStorage.getItem("OtherToken");
    }
    SwitchOtherTokenLabel();
    changeEvent("#OtherTokenValue");
}

var guideChimp = null;
function setupGuide() {
    if (guideChimp != null) {
        createTutorial(guideChimp);
        return;
    }
    guideChimp = createTutorial(guideChimp);
    guideChimp.on("onStop", ()=>{
        localStorage.setItem("Tutorial-N", guideChimp.currentStepIndex);
    });
    guideChimp.on("onComplete", ()=>{
        localStorage.removeItem("Tutorial-N");
    });

    my$("#play").addEventListener("mouseover", function() {
        if (my$("#calc").style.display != "")
            return;
        my$("#play").style.display = "none";
        my$("#play2").style.display = "block";
    });
    my$("#play").addEventListener("mouseout", function() {
        if (my$("#calc").style.display != "")
            return;
        my$("#play").style.display = "block";
        my$("#play2").style.display = "none";
    });
    my$("#playButtons").addEventListener("click", function() {
        if (my$("#calc").style.display != "")
            return;
        startTutorial(guideChimp);
    });

    if (localStorage.getItem("Tutorial") != "Started") {
        startTutorial(guideChimp);
    }
}

function setupInfo() {
    my$("#infoB").addEventListener("mouseover", function() {
        my$("#infoB").style.display = "none";
        my$("#infoB2").style.display = "block";
    });
    my$("#infoB").addEventListener("mouseout", function() {
        my$("#infoB").style.display = "block";
        my$("#infoB2").style.display = "none";
    });
    my$("#infoButtons").addEventListener("click", function() {
        info();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    setupi18n();

    setupInfo();

    setupCurrency();

    setupFirstToken();
    setupOtherToken();

    my$("#cPriceToken").addEventListener("input", cCalculate);
    my$("#cPriceDFI").addEventListener("input", cCalculate);
    /*my$("#cPriceRatio").addEventListener("input", function() {
        priceRatio("c");
        calculate();
    });*/

    my$("#cAmountDFI").addEventListener("input", calculate);

    my$("#fPriceToken").addEventListener("input", fCalculate);
    my$("#fPriceDFI").addEventListener("input", fCalculate);
    /*my$("#fPriceRatio").addEventListener("input", function() {
        priceRatio("f");
        calculate();
    });*/

    my$("#apr").addEventListener("input", calculate);
    my$("#fee").addEventListener("input", calculate);
    my$("#duration").addEventListener("input", calculate);
    my$("#period").addEventListener("input", calculate);
    my$("#tax").addEventListener("input", calculate);

    my$("#sync").addEventListener("click", getPrices);
    my$("#copy").addEventListener("click", copyPrices);

    //changeEvent("#FirstTokenValue");
    //changeEvent("#OtherTokenValue");
    cCalculate();
    fCalculate();
    createEmptyPlot();
});

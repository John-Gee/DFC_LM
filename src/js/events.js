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
    });
    if (localStorage.getItem("Currency")) {
        my$("#CurrencyValue").selectedIndex = localStorage.getItem("Currency");
        changeEvent("#CurrencyValue");
    }
    SwitchCurrencyLabel();
}

function setupOtherCurrency() {
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
        SwitchTokenLabel();
        if ((my$("#OtherTokenValue").value == "USDC") || (my$("#OtherTokenValue").value == "USDT")) {
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
    if (localStorage.getItem("OtherToken")) {
        my$("#OtherTokenValue").selectedIndex = localStorage.getItem("OtherToken");
        changeEvent("#OtherTokenValue");
    }
    SwitchTokenLabel();
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

    setupOtherCurrency();

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

    createEmptyPlot();
});

var gSelects;

function closeDropDowns() {
    for (const select of gSelects) {
        if (select.isOpen())
            select.close();
    }
}

function setupi18n() {
    var select = new TsSelect2(my$("#i18n-toggler"), {
        minimumResultsForSearch: -1,
        width: "100%",
        dropdownAutoWidth : true,
        templateSelection: removeAccents,
        escapeMarkup: function (m) {
            return m;
        }
    });

    my$("#i18n-toggler").addEventListener("select2:opening", function() {
        closeDropDowns();
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

    return select;
}

function setupCurrency() {
    var select = new TsSelect2(my$("#CurrencyValue"), {
        minimumResultsForSearch: -1,
        width: "100%",
        dropdownAutoWidth : true,
        escapeMarkup: function (m) {
            return m;
        }
    });

    my$("#CurrencyValue").addEventListener("select2:opening", function() {
        closeDropDowns();
    });

    my$("#CurrencyValue").addEventListener("change", function() {
        SwitchCurrencyLabel();
        clearCPriceFirstToken();
        clearCPriceOtherToken();
        clearCPriceDFI();
    });

    if (localStorage.getItem("Currency")) {
        my$("#CurrencyValue").selectedIndex = localStorage.getItem("Currency");
        changeEvent("#CurrencyValue");
    }
    SwitchCurrencyLabel();
    clearCPriceFirstToken();
    clearCPriceOtherToken();
    clearCPriceDFI();

    return select;
}

function setupFirstToken() {
    var select = new TsSelect2(my$("#FirstTokenValue"), {
        minimumResultsForSearch: -1,
        width: "100%",
        dropdownAutoWidth : true,
        templateResult: formatCoin,
        templateSelection: formatCoin,
        escapeMarkup: function (m) {
            return m;
        }
    });

    my$("#FirstTokenValue").addEventListener("select2:opening", function() {
        closeDropDowns();
    });

    my$("#FirstTokenValue").addEventListener("change", function() {
        SwitchFirstTokenLabel();
        clearCPriceFirstToken();
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
        isATokenDFI();
    });

    if (localStorage.getItem("FirstToken")) {
        my$("#FirstTokenValue").selectedIndex = localStorage.getItem("FirstToken");
    }

    SwitchFirstTokenLabel();
    changeEvent("#FirstTokenValue");

    return select;
}

function setupOtherToken() {
    var select = new TsSelect2(my$("#OtherTokenValue"), {
        minimumResultsForSearch: -1,
        width: "100%",
        dropdownAutoWidth : true,
        templateResult: formatCoin,
        templateSelection: formatCoin,
        escapeMarkup: function (m) {
            return m;
        }
    });

    my$("#OtherTokenValue").addEventListener("select2:opening", function() {
            closeDropDowns();
    });

    my$("#OtherTokenValue").addEventListener("change", function() {
        SwitchOtherTokenLabel();
        clearCPriceOtherToken();
        isATokenDFI();
    });

    if (localStorage.getItem("OtherToken")) {
        my$("#OtherTokenValue").selectedIndex = localStorage.getItem("OtherToken");
    }
    SwitchOtherTokenLabel();
    changeEvent("#OtherTokenValue");

    return select;
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
    gSelects = new Array();

    gSelects.push(setupi18n());

    setupInfo();

    gSelects.push(setupCurrency());

    gSelects.push(setupFirstToken());
    gSelects.push(setupOtherToken());

    my$("#cPriceOtherToken").addEventListener("input", cCalculate);
    my$("#cPriceFirstToken").addEventListener("input", cCalculate);

    my$("#cAmountFirstToken").addEventListener("input", calculate);

    my$("#fPriceOtherToken").addEventListener("input", fCalculate);
    my$("#fPriceFirstToken").addEventListener("input", fCalculate);

    my$("#apr").addEventListener("input", calculate);
    my$("#fee").addEventListener("input", calculate);
    my$("#duration").addEventListener("input", calculate);
    my$("#period").addEventListener("input", calculate);
    my$("#tax").addEventListener("input", calculate);

    my$("#sync").addEventListener("click", getPrices);
    my$("#copy").addEventListener("click", copyPrices);

    cCalculate();
    fCalculate();
    createEmptyPlot();
});

document.addEventListener("DOMContentLoaded", function() {
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

    window.addEventListener('resize', WindowResize);
    WindowResize();

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
    my$("#period").addEventListener("input", calculate);

    my$("#sync").addEventListener("click", getPrices);

    createEmptyPlot();

    var guideChimp = createTutorial();
    guideChimp.on("onStop", ()=>{
        localStorage.setItem("Tutorial-N", guideChimp.currentStepIndex);
    });
    guideChimp.on("onComplete", ()=>{
        localStorage.removeItem("Tutorial-N");
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
        startTutorial(guideChimp);
    });
    if (localStorage.getItem("Tutorial") != "Started") {
        startTutorial(guideChimp);
    }
});

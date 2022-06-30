const { execSync } = require("child_process");
const Fs = require('fs');
const Path = require('path');
const Puppeteer = require('puppeteer');

(async () => {
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.defiscan.live/dex");
    await page.waitForSelector("a.contents");
    const acontents = await page.$$("a.contents");
    const imageFolder = "../docs/img/";
    const dTokens = new Set();
    const dTokensList = "gen/dTokens.txt";
    Fs.writeFileSync(dTokensList, "");

    for (const acontent of acontents) {
        const href = await (await acontent.getProperty("href")).jsonValue();
        let dToken = href.substring(26);
        if (dToken == "DUSD")
            dToken = "dUSD";

        if (dTokens.has(dToken))
            continue;

        Fs.appendFileSync(dTokensList, dToken + "\n");
        const img = Path.join(imageFolder, dToken + ".svg");

        if (Fs.existsSync(img))
            continue;

        console.log("Adding " + dToken + " to the list.")
        const svg = await acontent.$("svg");
        if (svg == null) {
            continue;
        }
        dTokens.add(dToken);

        let outer = await (await svg.getProperty("outerHTML")).jsonValue();
        // The first is needed to display the code as an SVG, the second sets the svg's default size
        outer = outer.replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"")
                     .replace("height=\"1em\"", "height=\"32\"")
                     .replace("width=\"1em\"", "width=\"32\"");
        Fs.writeFileSync(img, outer);
        const cleanimg = img.replace(".svg", ".clean.svg");
        console.log("running svgcleaner --multipass " + img + " " + cleanimg);
        execSync("svgcleaner --multipass " + img + " " + cleanimg);
        if (! Fs.existsSync(cleanimg)) {
            console.log("running svgcleaner " + img + " " + cleanimg);
            execSync("svgcleaner " + img + " " + cleanimg);
        }

        const cleangoimg = cleanimg.replace(".svg", ".go.svg");
        console.log("running npx svgo --multipass  " + cleanimg + " -o " + cleangoimg);
        execSync("npx svgo --multipass  " + cleanimg + " -o " + cleangoimg);

        const bestimg = cleangoimg;
        if (Fs.statSync(cleanimg).size < Fs.statSync(cleangoimg).size) {
            bestimg = cleanimg;
            Fs.unlinkSync(cleangoimg);
        } else {
            Fs.unlinkSync(cleanimg);
        }
        if (Fs.statSync(bestimg).size < Fs.statSync(img).size) {
            Fs.renameSync(bestimg, img);
        } else {
            Fs.unlinkSync(bestimg);
        }

        execSync("git add " + img);
    }

    await browser.close();
})();

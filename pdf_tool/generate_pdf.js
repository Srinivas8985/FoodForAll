
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Path to the HTML file
        const htmlPath = path.join(__dirname, '..', 'project_report.html');
        const pdfPath = path.join(__dirname, '..', 'FoodForAll_Project_Report.pdf');

        // Convert windows path to file URL
        const fileUrl = 'file://' + htmlPath.replace(/\\/g, '/');

        console.log(`Loading ${fileUrl}...`);
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });

        console.log('Generating PDF...');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        console.log(`PDF created successfully at: ${pdfPath}`);
        await browser.close();
    } catch (error) {
        console.error('Error generating PDF:', error);
        process.exit(1);
    }
})();

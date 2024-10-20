require('dotenv').config()
//
const fs = require('fs');
const path = require('path');
//
const emotive = require('./emotive.js');
const batch = require('./batch.js');
const executive = require('./executive.js');
const datatrails = require('./datatrails.js');

const srcFolder = "/home/steev/work/wip/tadhack/rnd/fake-vcons/original_brisbane_vcons/";
// const srcFolder = "/home/steev/work/wip/tadhack/rnd/fake-vcons/2024/05/03/";
// const srcFolder = "/home/steev/work/wip/tadhack/idea3/myvcon";
const destFolder = "cooked";


// Old example for working with single files:
if (false) {
    const data = fs.readFileSync(src);
    const json = JSON.parse(data);
    const r = emotive.process(src, json, "Customer");
    console.log(r);
}



(async () => {
    // TODO: Use this
    // datatrails.getToken(process.env.API_DATA_TRAILS_CLIENT, process.env.API_DATA_TRAILS_SECRET);

    console.log("Processing...");

    const reportList = [];
    await batch.processFilesInDirectory(srcFolder, async (srcFile) => {
        try {
            const data = fs.readFileSync(srcFile);
            const json = JSON.parse(data);
            
            const report = emotive.process(srcFile, json, "Customer");
            
            reportList.push(report);


            // Write our synopsis, by copying out _only_ the relevant fields
            const synopsis = {
                version:        1,
                processor:      "tadhack::basic::natural.SentimentAnalyzer::8.0.1",
                //
                uuid:           report.uuid,
                flow:           report.flow,
                progression:    report.progression,
            };
            

            // Our special file
            const destFilepath = path.join(destFolder, report.uuid);
            fs.writeFileSync(destFilepath, JSON.stringify(synopsis));


            const attributeData = {
                "behaviours": ["RecordEvidence"],
                "attributes": {
                  "arc_display_type": "Support",
                  "arc_display_name": `Call ${report.uuid}`,
                  "type": "support_call",
                  "uuid": report.uuid,
                },
                "public": false
            };
            const filepathAttributes = destFilepath + ".attr";
            fs.writeFileSync(filepathAttributes, JSON.stringify(attributeData));

            // // Upload to data trails
            // const scittResponse = await datatrails.uploadAsset(filepathAttributes);

            // // Save our SCITT confirmation file
            // const scittFilepath = destFilepath + ".scitt";
            // fs.writeFileSync(scittFilepath, JSON.stringify(scittResponse));

            // console.log(scittResponse);

        } catch(e) {
            // Ignore non-JSON files
            // console.log(e)
        }

    });


    console.log("In summary...");
    executive.summarize(reportList);

})();

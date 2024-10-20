const _ = require("lodash");
const asciichart = require ('asciichart')


function title(text) {
    console.log(``);
    console.log(text);
    console.log("=".repeat(text.length));
    console.log(``);
}

function writeVConLine(r) {
    console.log(`${r.uuid} (${r.vcon.party("agent").name})`);
}

function writeVConConversationIssues(r) {

    // What caused the downturns?
    r.progression.state.forEach((state) => {
        if (state.direction < 0) { 
            // i.e. a downturn
            writeVConConversationLine(r, state.atLine - 2);
            writeVConConversationLine(r, state.atLine - 1);
            writeVConConversationLine(r, state.atLine);
            console.log(" --");
        }
    })
}

function writeVConConversationLine(r, atLine) {
    // Cross-reference the sentiment
    const sentimentEntry = _.find(r.flow, function (flow) {
        return flow.conversationLine === atLine;
    });
    const sentiment = sentimentEntry ? sentimentEntry.sentiment : 0;

    // Write
    const whoSaid = r.vcon.conversation.line(atLine);
    const analysisIndex = r.vcon.conversation.analysisIndex;
    const jsonpath = `$.analysis[${analysisIndex}].body[${atLine}].message`;
    console.log(` (line ${atLine}) ${whoSaid.speaker} : ${whoSaid.message}  (s# ${sentiment.toFixed(3)}, jsonpath# ${jsonpath})`);
}


function writeVConConversationGraph(r) {
    // Uses https://github.com/kroitor/asciichart
    const lines = r.vcon.conversation.length;
    const width = 5;

    let graphList = [];
    for (let atLine = 0; atLine < lines; ++atLine) {
        const whoSaid = r.vcon.conversation.line(atLine);
        if (whoSaid.speaker === 'Customer') {
            // Cross-reference the sentiment
            const sentimentEntry = _.find(r.flow, function (flow) {
                return flow.conversationLine === atLine;
            });
            const sentiment = sentimentEntry ? sentimentEntry.sentiment : 0;

            // Build the graph data
            graphList.push(sentiment);
        }
    }

    // To make the graph easier to read, we duplicate every item N times, to give
    // the graph a better width.
    // Idea from: https://stackoverflow.com/questions/33305152/how-to-duplicate-elements-in-a-js-array
    const dublicateItems = (arr, numberOfRepetitions) => 
        arr.flatMap(i => Array.from({ length: numberOfRepetitions }).fill(i));
    graphList = dublicateItems(graphList, width);

    // Render!
    console.log(asciichart.plot(graphList, { height: 8 }))
}




async function summarize(reportList) {
    title("Good Conversations - i.e. always improving");

    reportList.forEach((r) => {
        if (r.progression.state.length === 0 && r.progression.startDirection > 0) {
            writeVConLine(r);
        }
    });


    title("Bad Conversations - i.e. always failing");
    reportList.forEach((r) => {
        if (r.progression.state.length === 0 && r.progression.startDirection < 0) {
            writeVConLine(r);
            // Always falling, so review whole conversation as there's no changes to report
            // We show it visually, though, to catch the eye
            writeVConConversationGraph(r);
        }
    });

    // console.log(reportList);

    title("Check these Conversations - i.e. lots of fluctuations");

    const worseOffender = _.maxBy(reportList, (r) => r.progression.state.length);
    const changes = worseOffender.progression.state.length;
    console.log(`(there are ${changes} changes in these conversations)\n`)

    reportList.forEach((r) => {
        if (r.progression.state.length === changes) {
            writeVConLine(r);
            writeVConConversationIssues(r);
            writeVConConversationGraph(r);
        }
    });


}

module.exports.summarize = summarize;

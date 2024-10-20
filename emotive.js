const natural = require("natural");

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");

const vCon = require('./vcon.js');


function determineSentimentFlow(conversation, speakerName) {
    let flow = [];

    for(let i=0;i<conversation.length;++i) {
        if (conversation.line(i).speaker === speakerName) {
            const result = analyzer.getSentiment(conversation.line(i).message.split(" "));

            // Ignore neutral sentiments. e.g. phrases like "ok", 
            if (result) {
                flow.push({
                    conversationLine: i,
                    sentiment: result,
                });
            }

        }
    }

    return flow;
}


function determineProgression(flow) {
const epsilon = 0.1;
let direction;
let previous = 0;
let previousDirection;
let report = {
    state: []
};

    flow.forEach((f) => {
        // See how much the sentiment has changed
        // (and require the change to be reasonable, i.e. > epsilon)
        let delta = f.sentiment - previous;
        if (Math.abs(delta) < epsilon) {
            delta = 0;
        }
        direction = Math.sign(delta);

        // Special-ish case for the first iteration
        if (typeof previousDirection === typeof undefined) {
            // First entry - this determines whether the conversation starts in an
            // increasing, or decreasing fashion;
            // direction = Math.sign(f.sentiment);
            direction = Math.sign(f.sentiment);
            report.startDirection = direction;

        } else {
            if (direction != previousDirection) {
                report.state.push({
                    direction,
                    previousDirection,
                    atLine: f.conversationLine
                })
            }
        }

        previous = f.sentiment;
        previousDirection = direction

    });

    return report;
}


function process(filename, json, speakerName) {
    const vcon = new vCon(json);
    const conversation = vcon.conversation;
    const flow = determineSentimentFlow(conversation, speakerName);
    const progression = determineProgression(flow);

    return {
        src: filename,
        uuid: json.uuid,
        vcon,
        //
        flow,           // all non-0 sentiment data
        progression     // only changes in direction of sentiment

    }
}

module.exports.process = process;
class Party {
    constructor(partyData) {
        this._name = partyData.name;
        this._email = partyData.mailto;
        this._telephone = partyData.tel;
    }

    get name() {
        return this._name;
    }

    get email() {
        return this._email;
    }

    get telephone() {
        return this._telephone;
    }

}


class Conversation {
    constructor(analysisIndex, conversationData) {
        this._conversationData = conversationData;
        this._analysisIndex = analysisIndex;
    }

    line(idx) {
        return this._conversationData[idx];
    }

    get length() {
        return this._conversationData.length;
    }

    get analysisIndex() {
        return this._analysisIndex;
    }

}


class vCon {
    constructor(data) {
        this._data = data;

        let whichAnalysis = data.analysis.findIndex(o => o.type === "analysis_info");
        if (whichAnalysis === -1) {
            whichAnalysis = data.analysis.findIndex(o => o.type === "transcript");
        }
        this._conversation = new Conversation(whichAnalysis, data.analysis[whichAnalysis].body);
    }


    party(type) {
        let partyData = undefined;

        this._data["parties"].forEach((p) => {
            if (p.meta.role === type) {
                partyData = new Party(p);
            }
        })

        return partyData;
    }

    get conversation() {
        return this._conversation;
    }
    
}

module.exports = vCon;

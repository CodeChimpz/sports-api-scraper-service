import {model, Schema} from "mongoose";

interface IGame {

}

const odds = {
    open: {
        total: {type: Number},
        overOdds: {type: Number},
        underOdds: {type: Number},
    },
    current: {
        total: {type: Number},
        overOdds: {type: Number},
        underOdds: {type: Number},
    },
}
export const gameSchema = new Schema({
    schedule: {
        date: {
            type: Date,
            required: false
        }
    },
    summary: {type: String, required: true},
    status: {type: String, required: true},
    // teams: []
    teams: [{type: String, required: false}],
    lastUpdated: {type: Date, required: false},
    gameId: {type: String},
    //Relation ?
    odds: [{
        spread: {...odds},
        moneyline: {...odds},
        total: {...odds},
        openDate: {type: Date}
    }],
    venue: [{type: String}],
    scoreboard: {
        score: {
            away: {type: String, required: true},
            home: {type: String, required: true}
        },
        currentPeriod: {type: Number},
        periodTimeRemaining: {
            type: String, default: '0:00'
        }
    }

})

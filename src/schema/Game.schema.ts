import {model, Schema} from "mongoose";

interface ITeam {
    team: string,
    location: string,
    mascot: string,
    abbreviation: string,
    conference: string,
    division: string
}

interface IMoneyLineOdds {
    awayOdds: number
    homeOdds: number
}

interface ISpreadOdds {
    away: number
    home: number
    awayOdds: number
    homeOdds: number
}

interface ITotalOdds {
    overOdds: number
    underOdds: number
}

export interface IOdds<TOddType> {
    open: TOddType
    current: TOddType
}

type IOddsArray = Array<{
    spread: {
        open: ISpreadOdds,
        current: ISpreadOdds
    },
    moneyline: {
        open: IMoneyLineOdds,
        current: IMoneyLineOdds
    },
    total: {
        open: ITotalOdds,
        current: ITotalOdds
    }
}>

//
export interface IGame {
    schedule: {
        date?: Date
    }
    summary: string,
    status: string,
    //todo: team entity
    teams?: {
        away: ITeam,
        home: ITeam
    }
    lastUpdated?: Date
    gameId: string,
    odds: Array<{ moneyline: IOdds<IMoneyLineOdds>, spread: IOdds<ISpreadOdds>, total: IOdds<ITotalOdds>, openDate: Date, lastUpdated: Date }>,
    venue: string[],
    scoreboard: {
        score: {
            away: number,
            home: number
        },
        currentPeriod: number,
        periodTimeRemaining?: string
    }

}

//todo: distinct documents and Schemas for Team and Odds ? Test if embed or relation works faster
const teamSchema = {
	team: {type: String},
	location: {type: String},
	mascot: {type: String},
	abbreviation: {type: String},
	conference: {type: String},
	division: {type: String}

}

const spreadSchema = {
	away: {type: Number},
	home: {type: Number},
	awayOdds: {type: Number},
	homeOdds: {type: Number}
}

const moneylineSchema = {
	awayOdds: {type: Number},
	homeOdds: {type: Number}
}

const totalSchema = {
	total: {type: Number},
	overOdds: {type: Number},
	underOdds: {type: Number},
}

export const gameSchema = new Schema<IGame>({
	schedule: {
		date: {
			type: Date,
		}
	},
	summary: {type: String, required: true},
	status: {type: String, required: true},
	teams: {
		home: teamSchema,
		away: teamSchema
	},
	lastUpdated: {type: Date},
	gameId: {type: String, required: true},
	//todo : Relation ?
	odds: [
		{
			spread: {
				open: spreadSchema,
				current: spreadSchema
			},
			moneyline: {
				open: moneylineSchema,
				current: moneylineSchema
			},
			total: {
				open: totalSchema,
				current: totalSchema
			},
			openDate: {type: Date},
			lastUpdated: {type: Date}
		}
	],
	venue: {
		name: {type: String},
		city: {type: String},
		state: {type: String},
		neutralSite: {type: Boolean},
	},
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



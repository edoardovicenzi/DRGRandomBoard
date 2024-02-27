import primaryObjectives from "../data/primaryObjectives.json"
import secondaryObjectives from "../data/secondaryObjectives.json"
import normalDie, { chooseDie } from "./dices";

export default class MissionInfo {
    #mineralCoinFlips = true
    #mineralRule = {
        type : "ratio",
        goldRatio: 1/3,
    }
    #infos = {
        primaryObjective :  {
            name: "",
            desc: ""
        },
        secondaryObjective : {
            name: "",
            desc: ""
        },
        minerals:{
            gold: 0,
            nitra:0,
            aquarq: 0,
            morkite:0,
            total:0,
        },
        tokens: {
            lootBugs: 0,
            barleyBulbs: 0,
            redSugar: 0
        },
        missionEvent: {
            name: "",
            desc: ""
        },
        flares: 5
    };


    constructor(flares = 8){
        this.#infos.flares = flares
        this.generateAll()
    }

    getInfos(){
        return this.#infos
    }
    generateAll(){
        this.generatePrimary()
        this.generateSecondary()
        this.throwDices()
        this.generateMinerals()
        this.generateTokens()
        this.updateMineralCount()
    }
    generatePrimary(){
        const key = Object.keys(primaryObjectives)[Math.floor(Math.random()*Object.keys(primaryObjectives).length)]
        return this.#infos.primaryObjective = {...primaryObjectives[key], id: key}
    }
    generateSecondary(){
        const availableObjectives = []
        for (const [key, value] of Object.entries(secondaryObjectives)){
            if (!value.exclusivity.includes(this.#infos.primaryObjective.id)) availableObjectives.push({[key]: value})
        }
        const item = availableObjectives[Math.floor(Math.random()*availableObjectives.length)]
        return this.#infos.secondaryObjective = {...item[Object.keys(item)[0]], id: Object.keys(item)[0]}
    }
    throwDices(){
        //throw for primary
        if (this.#infos.primaryObjective.die != null){
            this.#infos.primaryObjective.final = this.#infos.primaryObjective.default + chooseDie(this.#infos.primaryObjective.die) 
        }
        //throw for secondary
        if (this.#infos.secondaryObjective.die != null){
            this.#infos.secondaryObjective.final = this.#infos.secondaryObjective.default + chooseDie(this.#infos.secondaryObjective.die) 
        }
    }
    generateMinerals(){
        let totalMinerals = 0
        //calculate primary minerals
        if (this.#infos.primaryObjective.final != null){
            totalMinerals += this.#infos.primaryObjective.final * this.#infos.primaryObjective.modifier 
        }
        else {
            totalMinerals += this.#infos.primaryObjective.modifier 
        }
        //calculate secondary objective
        if (this.#infos.secondaryObjective.final != null){
            totalMinerals += this.#infos.secondaryObjective.final * this.#infos.secondaryObjective.modifier 
        }
        else{
            totalMinerals += this.#infos.secondaryObjective.modifier 
        }
        //handle coin flip
        if (this.#mineralCoinFlips && !Number.isInteger(totalMinerals)) {
            let flip = Math.round(Math.random())
            flip ? totalMinerals = Math.ceil(totalMinerals) : totalMinerals = Math.floor(totalMinerals)
        }
        else totalMinerals = Math.round(totalMinerals)
        //calculate mineral split by calculating the gold first
        switch (this.#mineralRule.type) {
            case "ratio":
                this.#infos.minerals.gold = Math.floor(totalMinerals*this.#mineralRule.goldRatio)
                break
            //defaults to dice roll
            default:
                this.#infos.minerals.gold = normalDie(totalMinerals)
        }
        this.#infos.minerals.nitra = totalMinerals - this.#infos.minerals.gold
    }
    mineralRoll(numberOfRolls){
        for (let i = 0; i< numberOfRolls; i++){
            let roll = chooseDie("mineral")
            if (roll === "empty") this.#infos.tokens.redSugar += 1
            if (roll === "nitra") this.#infos.tokens.barleyBulbs += 1
            if (roll === "gold") this.#infos.tokens.lootBugs += 1
            }
    } 
    
    generateTokens(){
        if (this.#infos.primaryObjective.id === "alienEggs"){
            this.mineralRoll(this.#infos.flares - this.#infos.primaryObjective.final)
        }
        if (this.#infos.secondaryObjective.id === "alienFossils" || this.#infos.secondaryObjective.id ==="apocaBlooms"){
            this.mineralRoll(this.#infos.flares - this.#infos.secondaryObjective.final)
        }
    }
    updateMineralCount(){
        if (this.#infos.primaryObjective.id === "aquarq") this.#infos.minerals.aquarq += this.#infos.primaryObjective.final
        else if (this.#infos.primaryObjective.id === "morkite") this.#infos.minerals.morkite += this.#infos.primaryObjective.final
        if (this.#infos.secondaryObjective.id === "morkite") this.#infos.minerals.morkite += this.#infos.secondaryObjective.final
        this.#infos.minerals.total = this.#infos.minerals.gold + this.#infos.minerals.nitra + this.#infos.minerals.aquarq + this.#infos.minerals.morkite
    }
}

export default function normalDie(faces = 6){
    return Math.floor(Math.random()*faces + 1)
}
export function d20(){
    return Math.floor(Math.random()*20 + 1)
}
export function piercingDie(){
    const values= [0, 1,1,1,2,2]
    return values[Math.floor(Math.random()*values.length)]
}
export function bulletDie(){
    const values= [0,0,1,1,1,1]
    return values[Math.floor(Math.random()*values.length)]
}
export function mineralDie(){
    const values= ["empty", "empty", "gold", "gold", "nitra", "nitra"]
    return values[Math.floor(Math.random()*values.length)]
}
export function chooseDie(diceName){
    switch (diceName){
        case "bullet":
            return bulletDie()
        case "armor":
            return piercingDie()
        case "mineral":
            return mineralDie()
        case "d20":
            return d20()
        default:
            return normalDie()
    }
}

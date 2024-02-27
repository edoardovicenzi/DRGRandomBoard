import { useReducer } from "react"
import MissionInfo from "./functions/generate"
const baseOptions = {
    useDefaultRules : false,
    flipCoinForDecimals : false,
    caveNumber : 5,
}

function reducer(state, {type, payload}){
    switch (type){
        case "checkbox":
        return {...state, [payload.name] : payload.value}

        default:
            console.log("Action not recognized")
    }
}
export default function App() {
    const [options, dispatch] = useReducer(reducer, baseOptions)
    function handleForm(e){
        e.preventDefault()
            let info = new MissionInfo()
            console.log(info.getInfos())
    }
    return (
    <div className="main-wrapper">
            <form onSubmit={e => handleForm(e)}>
                <ul>
                    <li>
                        <label htmlFor="use-default-rules">Use modded rules?</label>
                        <input type="checkbox" name="useDefaultRules" id="use-default-rules" value={options.useDefaultRules} onChange={(e) => dispatch({type: "checkbox", payload: {name: e.target.name, value: e.target.checked}})}/>
                    </li>
                    <li>
                        <label htmlFor="flip-coin-for-decimal">Flip a coin on decimal numbers?</label>
                        <input type="checkbox" name="flipCoinForDecimals" id="flip-coin-for-decimal"value={options.flipCoinForDecimals} onChange={(e) => dispatch({type: "checkbox", payload: {name: e.target.name, value: e.target.checked}})}/>
                    </li>
                </ul>
                <button type="submit">Done</button>
            </form>
        </div>
    )
}

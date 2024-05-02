import React from "react"

export default function App(): JSX.Element {

  const [input, setInput] = React.useState<string>("")

  return (
    <input id="UserInput" type="text" value={input} onChange={(e) => setInput(e.target.value)}></input>
    // <TextField id="UserInput" label="input" variant={"outlined"} sx={{color:"primary", height:"50%"}}/>
  )
}
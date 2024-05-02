import React from "react"

import { TextField } from "@mui/material"

export default function App(): JSX.Element {

  const [input, setInput] = React.useState<string>("")

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key==="Enter"){setInput("")}
  }

  return (
    <input
    id="UserInput"
    type="text"
    value={input}
    onChange={(e)=>{setInput(e.target.value);}}
    onKeyDown={handleEnter}
    ></input>
    // <TextField id="UserInput" label="input" variant={"standard"} sx={{color:"primary"}}/>
  )
}


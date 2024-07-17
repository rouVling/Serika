import React from "react";
import { DialogMessage } from "./types";
import { Paper, TextField } from "@mui/material";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export default function DialogBubble(props: DialogMessage): JSX.Element {
  // if (props.role === "user") {
  if (props.role === "user") {
    // if (props.role === "assistant") {
    return <Paper className="dialogBubble userBubble" sx={{ backgroundColor: "rgba(50, 50, 100, 0.5)", color: "rgb(200, 200, 200)", borderRadius: "10px" }}>
      <div>
        {props.img ? <img src={"data:image/png;base64," + props.img} /> : undefined}
        {props.content}
      </div>
    </Paper>
  }

  else if (props.role === "assistant") {
    return <Paper className="dialogBubble assistantBubble" sx={{ backgroundColor: "rgba(150, 50, 200, 0.5)", color: "rgb(200, 200, 200)", borderRadius: "10px" }} >{props.content}{props.voiceUrl ? <VolumeUpIcon onClick={() => {
      // play voice
      if (props.voiceType === "string") {
        const audio = new Audio(props.voiceUrl as string)
        audio.oncanplay = () => {
          audio.play()
        }
      }
      else if (props.voiceType === "element") {
        (props.voiceUrl as HTMLAudioElement).play()
      }
    }} /> : undefined}</Paper>
  } else {
    return <Paper sx={{ display: "flex", justifyContent: "center" }}>{props.content}</Paper>
  }
}

// backgroundColor: "rgba(50, 50, 100, 0.5)", color:"rgb(200, 200, 200)" ,display: "flex", justifyContent: "flex-end", margin: "3px", marginRight:"10px", marginLeft:"30%" ,padding: "3px", borderRadius: "10px", pointerEvents:"none", lineBreak:"anywhere"
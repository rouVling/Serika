import React, { useEffect } from "react"
import { DialogMessage } from "./types"
import DialogBubble from "./components"

import { Collapse, Paper, Box, TextField, Button } from "@mui/material"
import { promiseHooks } from "v8"
import { resolve } from "path"

import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { getVoiceLocal, getResponseGPT, getResponseGemini } from "./api"
import { ExponentialTimer } from "./utils"
import { dialog } from "electron"
import { LAppAdapter } from "./lappadapter"
import { windowsStore } from "process"


const lappmanager = LAppAdapter.getInstance()

export default function App(): JSX.Element {

  const [input, setInput] = React.useState<string>("")
  const [messages, setMessages] = React.useState<DialogMessage[]>([ ])
  const [disableInput, setDisableInput] = React.useState<boolean>(false)
  const [voiceUrl, setVoiceUrl] = React.useState<string>("")
  const [replayVoice, setReplayVoice] = React.useState<boolean>(false)
  const [hideChat, setHideChat] = React.useState<boolean>(false)
  const [expTimer, setExpTimer] = React.useState<ExponentialTimer | null>(null)
  const [img, setImg] = React.useState<string>("")
  const [apikey, setApikey] = React.useState<string>("")

  // IPC event listeners

  useEffect(() => {
    window.api.onUpdateScreenShotResult((value: string) => {
      setImg(value)
    })
    return () => {
      window.api.onUpdateScreenShotResult(() => { })
    }
  }, [])

  useEffect(() => {
    window.api.onUpdateApikey((value: string) => {
      setApikey(value)
    })
    return () => {
      window.api.onUpdateApikey(() => { })
    }
  }, [])

  // init store
  useEffect(() => {
    window.api.getStore("apikey").then((value: string) => {
      setApikey(value ? value : "")
    })
  }, [])


  useEffect(() => {
    const audio = new Audio(voiceUrl)
    audio.oncanplay = () => {
      audio.play()
    }
  }, [voiceUrl, replayVoice])

  useEffect(() => {
    // automatically scroll to the bottom
    const dialogContainer = document.getElementById("dialog-container")
    if (dialogContainer !== null) {
      // dialogContainer.scrollTop = dialogContainer.scrollHeight
      dialogContainer.scrollTo({ top: dialogContainer.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const expTimer = new ExponentialTimer(() => {
      // console.log("interval")

      getResponseGPT(
        [
          ...messages,
          { content: "用户已经一段时间没理你了，作为桌宠，请结合前面聊天内容，说点什么引起他的注意吧", role: "user" }  // modify it later
        ],
        apikey
      ).then((response) => {
        console.log("interval response: ", response)

        getVoiceLocal(response).then((url) => {
          setVoiceUrl(url)
          setMessages((prev) => [...prev, { content: response, role: "assistant", voiceUrl: new Audio(url), voiceType: "element" }])
        })
      }).catch((err) => {
        console.log(err)
      })
    }, 1 / 60, 180)

    // expTimer.start()

    setExpTimer(expTimer)

    return () => {
      expTimer?.stop()
    }
  }, [messages])

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input === "") {
        return
      }
      if (input.split(" ").join("") === "") {
        setInput("")
        return
      }
      setMessages((prev) => [...prev, { content: input, role: "user" }])
      // console.log(messages)  // not updated yet

      getResponseGPT([...messages, { content: input, role: "user" }], apikey).then((response) => {
        // getResponseGemini(
        //   [...messages, { content: input, role: "user" }],
        //   apikey,
        //   "你是一个桌面萌宠内置的AI，你需要给用户陪伴与亲密。在用户与你对话的时候，请使用尽可能简短的回答进行对话。请不要在回答中出现英文。如果需要使用，请使用其他表达方式替代，请不要使用 markdown 标记"
        // ).then((response) => {

        getVoiceLocal(response).then((url) => {
          setVoiceUrl(url)
          setMessages((prev) => [...prev, { content: response, role: "assistant", voiceUrl: new Audio(url), voiceType: "element" }])
        }).catch((err) => {
          console.log(err)
          setMessages((prev) => [...prev, { content: response, role: "assistant", voiceUrl: undefined }])
        })

      }).catch((err) => { console.log(err) })

      setInput("")
    }
  }

  return (<>
    <center>
      <div id="dialog-container" hidden={hideChat}>
        {
          img !== "" ? <img src={img} style={{ width: "inherit", borderRadius: "5px" }} /> : <></>
        }
        {
          messages.map((message, index) => {
            return (
              <DialogBubble key={index} {...message} />
            )
          })
        }
      </div>
    </center>
    {/* <center>
      <div
        id="hideChatButton"
        onClick={() => { setHideChat(!hideChat) }}
        style={{
          // borderBottom: "5px solid rgba(195, 201, 255, 0.671)",
          borderLeft: "80px solid transparent",
          borderRight: "80px solid transparent",
          transform: "rotateX(" + (hideChat ? "0deg" : "180deg"),
        }}
      ></div>
    </center> */}
    <div id="inputContainer">
      <center>
        <div id="buttonGroup">
          <button className="miniButton" id="hideChatButton" onClick={() => { setHideChat(!hideChat) }} ><ArrowDropDownIcon style={{
            transform: "rotateX(" + (hideChat ? "0deg" : "180deg"),
          }}/></button>

          <button className="miniButton" onClick={ () => window.api.getScreenShot() }><ScreenshotMonitorIcon /></button>

          <button className="miniButton" onClick={() => { setMessages(() => []) }}><DeleteIcon /></button>

          <button className="miniButton" id="settingButton" onClick={
            () => { window.api.openConfigWindow() } }> <SettingsIcon /> </button>

          {/* <button className="miniButton" onClick={
             () => {
              // console.log(lappmanager.getMotionGroups())
              // console.log(lappmanager.getMotionGroups())
              // lappmanager.startMotion(lappmanager.getMotionGroups()[0], 0, 1)
            // () => lappmanager.startMotion("Idle", 3, 1)
             } }><QuestionMarkIcon /></button> */}
        </div>
        {/* <Paper> */}
        <input
          id="UserInput"
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); }}
          onKeyDown={handleEnter}
          disabled={disableInput}
        ></input>
        {/* </Paper> */}
      </center>
    </div>
  </>
  )
}


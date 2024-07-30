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

import { getVoiceLocal, getVoiceOTTO, getResponseGPT, getResponseGemini } from "./api"
import { ExponentialTimer } from "./utils"
import { dialog } from "electron"
import { LAppAdapter } from "./lappadapter"
import { windowsStore } from "process"


const lappAdapter = LAppAdapter.getInstance()

export default function App(): JSX.Element {

  const [input, setInput] = React.useState<string>("")
  const [messages, setMessages] = React.useState<DialogMessage[]>([])
  const [disableInput, setDisableInput] = React.useState<boolean>(false)
  const [voiceUrl, setVoiceUrl] = React.useState<string>("")
  const [replayVoice, setReplayVoice] = React.useState<boolean>(false)
  const [hideChat, setHideChat] = React.useState<boolean>(false)
  const [expTimer, setExpTimer] = React.useState<ExponentialTimer | null>(null)
  const [img, setImg] = React.useState<string>("")

  const [apikey, setApikey] = React.useState<string>("")
  const [tokenSaveMode, setTokenSaveMode] = React.useState<boolean>(true)
  const [prompt, setPrompt] = React.useState<string>("")

  // IPC event listeners

  useEffect(() => {
    window.api.onUpdateScreenShotResult((value: string) => {
      setImg(value)
      console.log(value)
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

  useEffect(() => {
    window.api.onUpdateTokenSaveMode((value: boolean) => {
      setTokenSaveMode(value)
    })
    return () => {
      window.api.onUpdateTokenSaveMode(() => { })
    }
  }, [])

  useEffect(() => {
    window.api.onUpdatePrompt((value: string) => {
      setPrompt(value)
    })
    return () => {
      window.api.onUpdatePrompt(() => { })
    }
  }, [])

  useEffect(() => {
    window.api.onUpdateChara((folder: string, chara: string) => {
      lappAdapter.setChara(folder, chara)
    })
    return () => {
      window.api.onUpdateChara(() => { })
    }
  }, [])

  // init store
  useEffect(() => {
    window.api.getStore("apikey").then((value: string) => {
      setApikey(value ? value : "")
    })
  }, [])
  useEffect(() => {
    window.api.getStore("tokenSaveMode").then((value: boolean) => {
      setTokenSaveMode(value === undefined ? true : value)
    })
  }, [])
  useEffect(() => {
    window.api.getStore("prompt").then((value: string) => {
      setPrompt(value ? value : "")
    })
  }, [])
  useEffect(() => {
    window.api.getStore("modelPath").then((value: string) => {
      window.api.getStore("modelName").then((value2: string) => {
        lappAdapter.setChara(value, value2)
      })
    })
  }, [])

  useEffect(() => {
    const audio = new Audio(voiceUrl)
    audio.oncanplay = () => {
      audio.play()
    }
  }, [voiceUrl, replayVoice])

  // JavaScript event listeners

  useEffect(() => {
    // automatically scroll to the bottom
    const dialogContainer = document.getElementById("dialog-container")
    if (dialogContainer !== null) {
      // dialogContainer.scrollTop = dialogContainer.scrollHeight
      dialogContainer.scrollTo({ top: dialogContainer.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const dragBar = document.getElementById("dragBar")
    dragBar?.addEventListener("pointerover", () => {
      // console.log("enable touching")
      setIgnoreMouseEvent(false)
    })
    dragBar?.addEventListener("pointerout", () => {
      // console.log("disable touching")
      setIgnoreMouseEvent(true)
    })
    return () => {
      dragBar?.removeEventListener("pointerover", () => { })
      dragBar?.removeEventListener("pointerout", () => { })
    }
  }, [])

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

        // getVoiceLocal(response).then((url) => {
        getVoiceOTTO(response).then((url) => {
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
      setMessages((prev) => [...prev, { content: input, role: "user", img: img === "" ? undefined : img }])
      // console.log(img)
      // console.log(messages)  // not updated yet

      // getResponseGPT(
      getResponseGemini(
        (img === "") ? [...messages, { content: input, role: "user" }] : [...messages, { content: input, role: "user", img: img }],
        apikey,
        prompt,
        // undefined,
        tokenSaveMode
      ).then((response) => {

        // getVoiceLocal(response).then((url) => {
        getVoiceOTTO(response).then((url) => {
          setVoiceUrl(url)
          setMessages((prev) => [...prev, { content: response, role: "assistant", voiceUrl: new Audio(url), voiceType: "element" }])
        }).catch((err) => {
          console.log(err)
          setMessages((prev) => [...prev, { content: response, role: "assistant", voiceUrl: undefined }])
        })

      }).catch((err) => { console.log(err) })

      setInput("")
      setImg("")
    }
  }

  const setIgnoreMouseEvent = (ignore: boolean) => {
    window.api.setIgnoreMouseEvent(ignore)
  }

  return (<>
    <center>
      <div
        id="dialog-container"
        hidden={hideChat}
        onPointerOver={() => { setIgnoreMouseEvent(false) }}
        onPointerOut={() => { setIgnoreMouseEvent(true) }}
      >
        {
          img !== "" ? <img src={"data:image/png;base64," + img} style={{ width: "inherit", borderRadius: "5px" }} /> : <></>
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
    <div id="inputContainer">
      <center>
        <div id="buttonGroup">
          <button
            className="miniButton"
            id="hideChatButton"
            onClick={() => { setHideChat(!hideChat) }}
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
          >
            <ArrowDropDownIcon style={{
              transform: "rotateX(" + (hideChat ? "0deg" : "180deg"),
            }} />
          </button>

          <button
            className="miniButton"
            onClick={() => window.api.getScreenShot()}
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
          > <ScreenshotMonitorIcon />
          </button>


          <button
            className="miniButton"
            onClick={() => { setMessages(() => []); setImg("") }}
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
          > <DeleteIcon />
          </button>

          <button
            className="miniButton"
            id="settingButton"
            onClick={() => { window.api.openConfigWindow() }}
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
          > <SettingsIcon /> </button>

          <button className="miniButton"
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
            onClick={
              () => {
                // console.log(lappAdapter.getMotionGroups())
                // lappAdapter.nextScene()
                // lappmanager.startMotion(lappmanager.getMotionGroups()[0], 0, 1)
                // () => lappmanager.startMotion("Idle", 3, 1)
                // for(let i = 0; i < lappAdapter.getExpressionCount(); i++) {
                  // console.log(lappAdapter.getExpressionName(i))
                // }

                if (lappAdapter.getExpressionCount() > 0) {
                  lappAdapter.setExpression(lappAdapter.getExpressionName(Math.floor(Math.random() * lappAdapter.getExpressionCount())))
                }
              }} ><QuestionMarkIcon /></button>

          {/* <button className="miniButton"
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
            onClick={
              () => {
                // console.log(lappAdapter.getMotionGroups())
                // lappAdapter.nextChara()
                lappAdapter.setChara("D:\\000\\personal\\serika\\src\\renderer\\Resources", "一坨")
                // lappmanager.startMotion(lappmanager.getMotionGroups()[0], 0, 1)
                // () => lappmanager.startMotion("Idle", 3, 1)
              }} ><QuestionMarkIcon /></button> */}
        </div>
        {/* <Paper> */}
        <input
          id="UserInput"
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); }}
          onKeyDown={handleEnter}
          disabled={disableInput}
          onPointerOver={() => { setIgnoreMouseEvent(false) }}
          onPointerOut={() => { setIgnoreMouseEvent(true) }}
          onPaste={(e) => {
            if (e.clipboardData.files[0].type === "image/png") {
              e.clipboardData.files[0].arrayBuffer().then((buffer) => {
                setImg(getBase64(new Uint8Array(buffer)))
              })
            }
            else {
              e.preventDefault()
            }
          }}
        ></input>
        {/* </Paper> */}
      </center>
    </div>
  </>
  )
}

function getBase64(unit8Array) {
  let keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;
  while (i < unit8Array.length) {
    chr1 = unit8Array[i++];
    chr2 = unit8Array[i++];
    chr3 = unit8Array[i++];

    enc1 = chr1 >> 2;
    enc2 = (chr1 & 3) << 4 | chr2 >> 4;
    enc3 = (chr2 & 15) << 2 | chr3 >> 6;
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
  }
  return output;
}
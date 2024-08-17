import React, { useEffect } from "react"
import { DialogMessage } from "./types"
import DialogBubble from "./components"

// import { Collapse, Paper, Box, TextField, Button } from "@mui/material"
import { StyleNameContext } from "../style/styleContext"
import { promiseHooks } from "v8"
import { resolve } from "path"

import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import SaveIcon from '@mui/icons-material/Save';

import { SendRegular, MoreHorizontalRegular, ChevronUpRegular, ScreenCutRegular,DeleteRegular, SettingsRegular, QuestionRegular } from "@fluentui/react-icons"

import { getVoiceLocal, getVoiceOTTO, getResponseGPT, getResponseGemini, getJsonResponseGemini, getJsonResponseGPT } from "./api"
import { ExponentialTimer } from "./utils"
import { dialog } from "electron"
import { LAppAdapter } from "../live2d/lappadapter"
import * as LappDefine from "../live2d/lappdefine"
import { windowsStore } from "process"

import { ButtonGroup, Slider } from "@mui/material"
import { ContactlessOutlined } from "@mui/icons-material"


const lappAdapter = LAppAdapter.getInstance()

export default function App(): JSX.Element {

  //@ts-ignore
  // const classes = defaultStyle()

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
  const [hiddenPrompt, setHiddenPrompt] = React.useState<string>("")

  const [saveOnDelete, setSaveOnDelete] = React.useState<boolean>(false)

  const [slideValue, setSlideValue] = React.useState<number>(1)

  const [model, setModel] = React.useState<string>("")
  const [getResponse, setGetResponse] = React.useState<Function>(() => { })
  const [modelExpressionDesc, setModelExpressionDesc] = React.useState<string>("")
  const [modelMotionDesc, setModelMotionDesc] = React.useState<string>("")
  const [modelDesc, setModelDesc] = React.useState<string>("")

  const [styleName, setStyleName] = React.useState<string>("default")

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

  useEffect(() => {
    window.api.onModelValueRequested((value) => {

      if (value.method === "get") {
        switch (value.body.name) {
          case "exps":
            let exps = []
            for (let i = 0; i < lappAdapter.getExpressionCount(); i++) {
              exps.push(lappAdapter.getExpressionName(i))
            }
            window.api.sendModelValue({ name: value, value: exps })
            break
          case "motions":
            const retval = {
              name: value, value: lappAdapter.getMotionGroups().map((name) => {
                return { group: name, num: lappAdapter.getMotionCount(name) }
              })
            }
            console.log("dialog/App.tsx: get motions")
            window.api.sendModelValue(retval)
            break
          default:
            break
        }
      } else if (value.method === "post") {
        switch (value.body.command) {
          case "setExpression":
            lappAdapter.setExpression(value.body.value)
            break
          case "setExpressionDesc":
            setModelExpressionDesc(JSON.stringify(value.body.value))
            break
          case "setMotion":
            lappAdapter.startMotion(value.body.value.group, value.body.value.num, LappDefine.PriorityForce)
            break
          // case "setMotionDesc":
          //   setModelMotionDesc(value.body.value)
          //   break
          case "setModelDesc":
            setModelDesc(value.body.value)
            break
          case "setMotionDesc":
            setModelMotionDesc(JSON.stringify(value.body.value))
            break
          default:
            break
        }
      } else {
        console.log("dialog/App.tsx: model value requested: ", value)
      }
      return () => {
        window.api.onModelValueRequested(() => { })
      }
    })
  }, [])

  useEffect(() => {
    window.api.onUpdateStyleName((value: string) => {
      setStyleName(value)
    })
    return () => {
      window.api.onUpdateStyleName(() => { })
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
    window.api.getStore("hiddenPrompt").then((value: string) => {
      setHiddenPrompt(value ? value : "")
    })
  }, [])
  useEffect(() => {
    window.api.getStore("saveOnDelete").then((value: boolean) => {
      setSaveOnDelete(value === undefined ? false : value)
    })
  }, [])
  useEffect(() => {
    window.api.getStore("modelPath").then((value: string) => {
      window.api.getStore("modelName").then((value2: string) => {
        lappAdapter.setChara(value, value2)
        window.api.getStore(value2 + ".exps").then((value3) => {
          if (value3) {
            setModelExpressionDesc(JSON.stringify(value3))
          }
        })
        window.api.getStore(value2 + ".motions").then((value3) => {
          if (value3) {
            setModelMotionDesc(JSON.stringify(value3))
          }
        })
        window.api.getStore(value2 + ".desc").then((value3) => {
          if (value3) {
            setModelDesc(value3)
          }
        })
      })
    })
  }, [])
  useEffect(() => {
    window.api.getStore("styleName").then((value: string) => {
      setStyleName(value)
    })
  }, [])

  useEffect(() => {
    const audio = new Audio(voiceUrl)
    audio.oncanplay = () => {
      audio.play()
    }
  }, [voiceUrl, replayVoice])

  useEffect(() => {
    // TODO: change the model
    setGetResponse(getJsonResponseGemini)
  }, [model])

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
      // getResponseGemini(
      getJsonResponseGemini(
      // getJsonResponseGPT(
        (img === "") ? [...messages, { content: input, role: "user" }] : [...messages, { content: input, role: "user", img: img }],
        apikey,
        prompt + "以往对话总结:\n" + hiddenPrompt,
        // undefined,
        "请在 responseText 中回复用户的对话，回复时请注意 prompt。" + "你使用live2d 作为形象，其描述如下:\n" + modelDesc + "\n请在 expression 中选择合适的表情（可为空）。表情选项及描述如下：\n" + modelExpressionDesc + "\n请选择合适的动作组，以及动作在组中的序号(可为空)。动作选项及描述如下:\n" + modelMotionDesc,
        // "https://api.openai-sb.com/v1/",
        undefined,
        tokenSaveMode,
      ).then((response) => {

        const jsonResponse = JSON.parse(response)
        if (jsonResponse.expression !== null && jsonResponse.expression !== undefined) { lappAdapter.setExpression(jsonResponse.expression) }
        if (jsonResponse.motion !== null && jsonResponse.modtion !== undefined) { lappAdapter.startMotion(jsonResponse.motion.group, jsonResponse.motion.index, LappDefine.PriorityForce) }
        response = jsonResponse.responseText

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
        className={styleName + "-dialogContainer"}
        hidden={hideChat}
        onPointerOver={() => { setIgnoreMouseEvent(false) }}
        onPointerOut={() => { setIgnoreMouseEvent(true) }}
      >
        {
          img !== "" ? <img src={"data:image/png;base64," + img} style={{ width: "inherit", borderRadius: "5px" }} /> : <></>
        }
        {
          <StyleNameContext.Provider value={styleName}>
            {messages.map((message, index) => {
              return (
                <DialogBubble key={index} {...message} />
              )
            })
            }
          </StyleNameContext.Provider>
        }
      </div>
    </center>
    <div className={styleName + "-inputContainer"}>
      <center>
        <div className={styleName + "-buttonGroup"}>
          <button
            className={styleName + "-miniButton " + styleName + "-hideChatButton"}
            // id="hideChatButton"
            onClick={() => { setHideChat(!hideChat) }}
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
            title="Hide/Show Chat"
          >
            {styleName === "fluent" && <ChevronUpRegular style={{transform: "rotateX(" + (hideChat ? "0deg" : "180deg")}}
            />}
            {styleName === "default" && 
            <ArrowDropDownIcon style={{
              transform: "rotateX(" + (hideChat ? "0deg" : "180deg"),
            }} />}
          </button>

          <button
            className={styleName + "-miniButton"}
            onClick={() => window.api.getScreenShot()}
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
            title="Screenshot"
          >
            {/* <ScreenshotMonitorIcon /> */}
            {styleName === "fluent" && <ScreenCutRegular />}
            {styleName === "default" && <ContentCutIcon />}
          </button>


          <button
            className={styleName + "-miniButton"}
            onClick={() => {
              if (saveOnDelete && messages.length > 0) {
                getResponseGemini(
                  [...messages, { role: "user", content: "你是一个智能桌面助手内置的AI。这条消息发送自智能助手系统。用户即将关闭此次对话，并且，用户可能会隔较长时间再进行对话。你的目标是对以往对话内容进行提炼，总结自己的形象，用户的形象，以及在回答中需要注意的内容，以及你想提醒自己的内容作为下一次prompt。请你作为一个总结系统和 prompt 专家，撰写下一次对话时的prompt。请保持描述简洁精确，内容精要。注意，你这次回答的是所有内容会直接记录为下一次prompt" }], apikey, prompt, tokenSaveMode).then((response) => {
                    window.api.setStore("hiddenPrompt", response)
                  })
              }
              setMessages(() => []); setImg("")
            }}
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
            title="Clear Chat"
          > 
            {styleName === "fluent" && <DeleteRegular />}
            {styleName === "default" && <DeleteIcon />}
          </button>

          <button
            className={styleName + "-miniButton " + styleName + "-settingButton"}
            // id="settingButton"
            onClick={() => { window.api.openConfigWindow() }}
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
            title="Settings"
          > 
            {styleName === "fluent" && <SettingsRegular />}
            {styleName === "default" && <SettingsIcon /> }
          </button>

          {/* <button
            className={styleName + "-miniButton"}
            onClick={() => {
              // setStyle(fdStyle())
              // const stl = fdStyle()
              // setStyle(stl)
            }}
            onPointerOver={() => { setIgnoreMouseEvent(false) }}
            onPointerOut={() => { setIgnoreMouseEvent(true) }}
            title="Model"
          > 
            {styleName === "fluent" && <QuestionRegular />}
            {styleName === "default" && <QuestionMarkIcon /> }
          </button> */}

        </div>
        <div
          className={styleName + "-inputGroup"}
          style={{ display: "flex", flexDirection: "row" }}
          onPointerOver={() => { setIgnoreMouseEvent(false) }}
          onPointerOut={() => { setIgnoreMouseEvent(true) }}
        >
          {
            styleName === "fluent" && <button
              style={{ backgroundColor: "transparent", color: "white", border: "none", height: "inherit" }}
            >
              <MoreHorizontalRegular />
              {/* <ChevronUpRegular /> */}
            </button>
          }
          <input
            className={styleName + "-userInput"}
            // id="UserInput"
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); }}
            onKeyDown={handleEnter}
            disabled={disableInput}
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
          {
            styleName === "fluent" && <button
              style={{ backgroundColor: "transparent", color: "white", border: "none", height: "inherit" }}
              onClick={() => { handleEnter({ key: "Enter" } as React.KeyboardEvent<HTMLInputElement>) }}
            ><SendRegular /></button>
          }
        </div>

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
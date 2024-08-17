import { makeStyles } from "@mui/styles"

export const defaultStyle = makeStyles({
  dialogContainer: {
    left: "5%",
    width: "90%",
    height: "calc(60vh - 60px)",
    marginTop: "calc(-60vh + 60px - 40px)",
    background: "linear-gradient(rgba(0, 0, 0, 0), rgba(118, 185, 237, 0.1))",
    overflowY: "auto",
    /* display: flex; */
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: "40px",
  }
})

export const fdStyle = makeStyles({
  dialogContainer: {
    left: "5%",
    // width: "90%",
    height: "calc(60vh - 60px)",
    marginTop: "calc(-60vh + 60px - 40px)",
    background: "linear-gradient(rgba(0, 0, 0, 0), rgba(118, 185, 237, 0.1))",
    overflowY: "auto",
    /* display: flex; */
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: "40px",
  }
})
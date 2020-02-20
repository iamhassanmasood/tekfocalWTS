import styled from "styled-components"
import { makeStyles} from "@material-ui/core/styles";
import BackGround from '../../assets/sidebarImage/Side-img.PNG'

export const useStyles = makeStyles(theme => ({
    grow: {
      flexGrow: 1,
      backgroundColor: "#1b1b1b",
      width:"100%"
    },
    root: {
      display: "flex"
    },

    menuButton: {
    },
    hide: {
      display: "none"
    },


    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    search: {
      position: "relative",
      borderRadius: "20px",
      height:"1.5rem",
      backgroundColor: "white",
      "&:hover": {
        backgroundColor: 'white'
      },
      marginRight: theme.spacing(),
      marginLeft: 0,
      float: "left",
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto"
      }
    },
    searchIcon: {
      width: theme.spacing(4),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "grey"
    },
    inputRoot: {
      color: "black"
    },
    inputInput: {
      padding: theme.spacing(0, 0, 0, 3),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200,
      }
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex"
      }
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    },

    appBar: {
      flexGrow: 1,
      backgroundColor: "#1b1b1b",
      width:"100%",

      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },

    appBarShift: {
      flexGrow: 1,
      backgroundColor: "#1b1b1b",
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      backgroundColor:`#0e84d1`
    },
    drawerOpen: {
      color: 'white',
      backgroundImage:`url(${BackGround})`,

      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      background: 'black',
      color: 'white',
      backgroundImage:`url(${BackGround})`,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1
      }
    },

    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: "flex-end"
    },

    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },

    sideBarName:{
      display:"inline"
    },
    sideBarNamesShift:{
      display:"none"
    },

    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    }
    
  }));

export const Wrapper = styled.div``
export const drawerWidth = 200;
export const LogoImage = styled.img`
  margin-right: 5px;
`
export const SideWrapper = styled.div`
  padding:10px;
  padding-left:20px;
`
export const NameItem = styled.span`
  margin-left: 6px; 
`
export const Anc = styled.a`

&hover:{
  width: 100%; height: 2px;
  border-style: solid;
  border-color: white;
  background-color: #0e84d1;
}
`
export const Icon = styled.i`
`
export const IconWrapper = styled.div`
color: white;

&:hover {
  color: #0e84d1;
}
`
export const Break = styled.br``
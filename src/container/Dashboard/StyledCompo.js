import styled from 'styled-components'

import { makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
      marginLeft: "230px",
      marginTop: 20
    },

    contentShift:{
        flexGrow: 1,
        padding: theme.spacing(2),
        marginLeft: "80px",
        marginTop: 20
    }
    
  }));
export const HeadingTag = styled.h3`font-weight:bold; margin-top: 10px; margin-bottom: 10px; font-size:16px;`
export const Wrapper = styled.div``
export const Break = styled.br``
export const Table = styled.table``
export const TableRow = styled.tr``
export const TableHead = styled.thead``
export const TableBody = styled.tbody``
export const TableHeadings = styled.th`font-size:14px;`
export const TableData = styled.td`font-size:14px;`
export const Label = styled.label`margin: 8px 0px 8px 0px;`
export const TabTitle = styled.span`
  padding :5px;
  margin-top: 5px;
  color: white;
  font-size: 20px;
  justify-content:center;
  `
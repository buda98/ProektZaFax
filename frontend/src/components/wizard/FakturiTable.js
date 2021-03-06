import React, {useState, useEffect} from 'react';
import axios from 'axios';
import GetAppIcon from '@material-ui/icons/GetApp';
import MaterialTable from 'material-table';
import { TablePagination } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import TextField from '@material-ui/core/TextField';

//Fix to the broken pagination
function PatchedPagination(props) {
  const {
    ActionsComponent,
    onChangePage,
    onChangeRowsPerPage,
    ...tablePaginationProps
  } = props;

  return (
    <TablePagination
      {...tablePaginationProps}
      // @ts-expect-error onChangePage was renamed to onPageChange
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      ActionsComponent={(subprops) => {
        const { onPageChange, ...actionsComponentProps } = subprops;
        return (
          // @ts-expect-error ActionsComponent is provided by material-table
          <ActionsComponent
            {...actionsComponentProps}
            onChangePage={onPageChange}
          />
        );
      }}
    />
  );
}


axios.defaults.baseURL = 'http://172.23.0.3:5000';



export default function FakturaTable(props) {
    const [data, setData] = useState([])
    const [godina, setGodina] = useState("")
    const [mesec, setMesec] = useState("")

    useEffect(() => {
      setData(props.data)
      getData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])


      function hangleClick(){
        new Promise((resolve,reject) => {
          axios.get('/faktura/zemiFakturiMesec', {
            responseType: 'blob',
            params: {
              mesec,
              godina
            }
          },{withCredentials:true}).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = response.headers['content-disposition'].split('filename=')[1];
            link.setAttribute('download', filename.substring(1).slice(0,-1));
            document.body.appendChild(link);
            link.click();
          });
        })
      }
      
       function getData(){
          axios.post("/faktura/getFakturi",{},{withCredentials:true}).then((response)=>{
            response.data.forEach((row)=>{
              row.datumNaIzdavanje=row.datumNaIzdavanje.replace("-",".").replace("-",".")
              row.rokZaNaplata=row.rokZaNaplata.replace("-",".").replace("-",".")
            })  
            setData(response.data)
          })
        }

    

    

    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "???????????????? ????????", field: "arhivskiBroj",
          validate: rowData => rowData.arhivskiBroj === undefined || rowData.arhivskiBroj === "" ? "Required" : true,
          editable: false
        },
        {
          title: "??????????", field: "mesec",
          validate: rowData => rowData.mesec === undefined || rowData.mesec === "" ? "Required" : true, 
          editable: false
        },
        {
          title: "????????????", field: 'godina',
          validate: rowData => rowData.godina === undefined || rowData.godina === "" ? "Required" : true,
          editable: false
        },
        {
            title: "??????????????", field: 'platena',
            validate: rowData => rowData.platena === undefined || rowData.platena === "" ? "Required" : true,
            type: 'boolean'
          },
          {
            title: "?????????? ???? ????????????????", field: 'datumNaIzdavanje',
            validate: rowData => rowData.datumNaIzdavanje === undefined || rowData.datumNaIzdavanje === "" ? "Required" : true,
            editable: false
          },
          {
            title: "?????????? ???? ??????????????", field: 'platenaNaDatum',
            validate: rowData => rowData.platenaNaDatum === undefined || rowData.platenaNaDatum === "" ? "Required" : true,
            type: 'date'
          },
          {
            title: "?????? ???? ??????????????", field: 'rokZaNaplata',
            validate: rowData => rowData.rokZaNaplata === undefined || rowData.rokZaNaplata === "" ? "Required" : true,
            editable: false
          },
          {
            title: "???????????? ??????????", field: 'vkupnaNaplata',
            validate: rowData => rowData.vkupnaNaplata === undefined || rowData.vkupnaNaplata === "" ? "Required" : true,
            editable: false
          },
    ]
    
    
        return (
          <div>
            <TextField
          id="mesec"
          label="??????????"
          placeholder="??????????"
          value={mesec}
          size="small"
          variant="outlined"
          type="number"
          onChange={(e)=>{setMesec(e.target.value)}}
          InputProps={{
            style: {fontSize: 15},
            inputProps: { min: 0, max: new Date().getMonth()+1 }
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
        />
                <TextField
          id="godina"
          label="????????????"
          placeholder="????????????"
          value={godina}  
          size="small"
          variant="outlined"
          type="Number"
          onChange={(e)=>{setGodina(e.target.value)}}
          InputProps={{
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
        />
                <IconButton onClick={hangleClick} style={{marginTop: "-12px", marginLeft: "10px"}} variant="contained">
                    <SystemUpdateAltIcon style={{height: "40px", width: "40px"}} fontSize="large"/>
                </IconButton>

                <br></br>
        <br></br> 
            <MaterialTable
              title="???????????????????? ????????????"
              columns={columns}
              data={data}
              components={{
                Pagination: PatchedPagination,

              }}
              actions={[
                {
                  icon: () => <GetAppIcon/>,
                  tooltip: 'Edit User',
                  onClick: (event, rowData) => new Promise((resolve,reject) => {
                    axios.get('/faktura/ZemiFaktura', {
                      responseType: 'blob',
                      params: {
                        fakturaid:rowData.id,
                        izbor:"excel"
                      }
                    },{withCredentials:true}).then((response) => {
                      console.log(response)
                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement('a');
                      link.href = url;
                      const filename = response.headers['content-disposition'].split('filename=')[1];
                      console.log(filename)
                      link.setAttribute('download', filename.substring(1).slice(0,-1));
                      document.body.appendChild(link);
                      link.click();
                    });
                  })
                },
              ]}
              editable={{
                onRowUpdate: (updatedRow,oldRow) => new Promise((resolve,reject) => {
                  axios.post("/faktura/platiFaktura",{
                    id:oldRow.id,
                    platenaNaDatum:updatedRow.platenaNaDatum,
                    platena:updatedRow.platena
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                })
      
              }}
                options={{
                  paging:true,
                  pageSize:20,       // make initial page size
                  emptyRowsWhenPaging: true,   //to make page size fix in case of less data rows
                  pageSizeOptions:[5,10,20],
                  actionsColumnIndex: -1, addRowPosition: "first",
                  headerStyle: {
                    fontSize: 13,
                  }
                }}
                
            />
            
            </div>
    );
        



        
}


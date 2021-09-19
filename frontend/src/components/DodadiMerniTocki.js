import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import { TablePagination } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";

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


axios.defaults.baseURL = 'http://192.168.0.29:5000';



export default function FirmiTable () {
    const [data, setData] = useState([])
    const [firmi, setFirmi] = useState([])
    const [nemaNeasocirani, setNemaAsocirani] = useState(false)
    useEffect(() => {
      getData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
      const reasociraj =()=>{
        axios.post("/storno/reasociraj",{},{withCredentials:true})
      }
      const proveriNeasocirani = () => {
        axios.post("/mernaTocka/najdiNeasocirani").then((res)=>{
          if(res.data.message==='true'){
            //EnableButton(1)
            setNemaAsocirani(false)
          }
          if(res.data.message==='false'){
            //EnableButton(0)
            setNemaAsocirani(true)
          }
        })
      }
      
      function getData(){
        reasociraj()
        proveriNeasocirani()
        
        var firmiNiza = []
         axios.post("/firmi/zemiFirmi",{},{withCredentials:true}).then((firmi)=>{
             firmi.data.rows.forEach((firma)=>{
                firmiNiza[firma.id] = firma.name 
                })
                
              setFirmi(firmiNiza)
           axios.post("/mernaTocka/getMerniTocki",{},{withCredentials:true}).then((response)=>{
            setData(response.data)
            proveriNeasocirani()  
          })

        })

        
      }

    

    

    const columns = [
        { title: "Мерна точка ИД", field: "tockaID",
         filtering:false,
         defaultSort:"desc",
         },
        {
          title: "Цена", field: "cena",
          validate: rowData => rowData.cena === undefined || rowData.cena === "" ? "Required" : true,
          filtering:false,
          type: "numeric"
        },
        {
          title: "Тарифа", field: "tarifa",
          validate: rowData => rowData.tarifa === undefined || rowData.tarifa === "" ? "Required" : true,
          filtering:false,
          editable: "onAdd"
          },
        {
          title: "Фирма", field: "firmaId",
          validate: rowData => rowData.firmaId === undefined || rowData.firmaId === "" ? "Required" : true,
          filtering:true,
          lookup: {...firmi}
        }]
    
    
        return (
            <div>
                {nemaNeasocirani ? <Typography style={{color:"#00aa00"}} ><h1>Нема неасоцирани мерни точки </h1></Typography>:<Typography style={{color:"#ff0000"}}><h1>Има неасоцирани мерни точки</h1></Typography>}
            
            <MaterialTable
              title="Мерни точки"
              columns={columns}
              data={data}
              components={{
                Pagination: PatchedPagination,
              }}
              editable={{
                onRowAdd: (newRow) => new Promise((resolve, reject) => {
                axios.post("/mernaTocka/dodadiMernaTocka",{
                  tockaID:newRow.tockaID,
                  cena:newRow.cena,
                  tarifa:newRow.tarifa,
                  firmaID:newRow.firmaId,
                },{withCredentials:true}).then(()=>{
                  getData()
                  resolve()
                })
                
              }),
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/mernaTocka/izbrisiMernaTocka",{
                    id:selectedRow.id
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                  resolve()
                }),
                onRowUpdate:(updatedRow,oldRow)=>new Promise((resolve,reject)=>{
                  axios.post("/mernaTocka/PromeniMernaTocka",{
                    id:oldRow.id,
                    firmaId:updatedRow.firmaId,
                    cena:updatedRow.cena
                  },{withCredentials:true}).then(()=>{
                    axios.post("/storno/reasociraj")
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


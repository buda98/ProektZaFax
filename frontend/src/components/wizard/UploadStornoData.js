import axios from 'axios';
import MaterialTable from 'material-table';
import { TablePagination } from '@material-ui/core';
import React,{Component} from 'react';

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

class UploadStornoData extends Component {
    constructor(props){
      super(props)
      this.handleChange = this.handleChange.bind(this);
    
      this.state = {
        selectedFile: null,
        data:[],
      };
      
      
    }



    



    componentDidMount() {
      this.getData()
    }
  
    
    getData(){
       axios.post("/storno/getStornos",{},{withCredentials:true}).then((response)=>{
        this.setState({data: response.data});
       })
     }

    onFileChange = event => {
      this.setState({ selectedFile: event.target.files[0] });
    
    };
    test = () =>{
      //this.props.editStep(0,0)
    }
     handleChange = (prvo, vtoro)=>{
      this.props.editStep(prvo,vtoro)
    }
    onFileUpload = () => {
      const formData = new FormData();
      if(this.state.selectedFile!==null){
      formData.append(
        "stornoData",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    
      axios.post("/storno/uploadStornoFile", formData,{withCredentials:true}).then((res)=>{
        if(res.data.message==="success"){
          this.test()
          this.getData()
          // console.log(this.state.data)
        }
      });
      }
      

    };
    
    fileData = () => {
    
      if (this.state.selectedFile) {
         
       
      } else {
        return (
          <div>
            <br />
            <span style={{fontSize: "16px"}}>???????????????? ???????????????? ???????? ???? ??????????????????</span>
          
          </div>
        );
      }
    };
    
    render() {
      const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "???????? ???? ?????????? ??????????", field: "brojNaMernaTocka",
          validate: rowData => rowData.brojNaMernaTocka === undefined || rowData.brojNaMernaTocka === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "?????????? ???? ??????????????????????", field: "mesecNaFakturiranje",
          validate: rowData => rowData.mesecNaFakturiranje === undefined || rowData.mesecNaFakturiranje === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "????????????", field: 'tarifa',
          validate: rowData => rowData.tarifa === undefined || rowData.tarifa === "" ? "Required" : true,
        },
        {
            title: "?????????????? ???? ????????????", field: 'datumNaPocetokNaMerenje',
            validate: rowData => rowData.datumNaPocetokNaMerenje === undefined || rowData.datumNaPocetokNaMerenje === "" ? "Required" : true,
          },
          {
            title: "???????? ???? ????????????", field: 'datumNaZavrshuvanjeNaMerenje',
            validate: rowData => rowData.datumNaZavrshuvanjeNaMerenje === undefined || rowData.datumNaZavrshuvanjeNaMerenje === "" ? "Required" : true,
          },
          {
            title: "?????????????? ????????????????", field: 'pocetnaSostojba',
            validate: rowData => rowData.pocetnaSostojba === undefined || rowData.pocetnaSostojba === "" ? "Required" : true,
          },
          {
            title: "???????????? ????????????????", field: 'krajnaSostojba',
            validate: rowData => rowData.krajnaSostojba === undefined || rowData.krajnaSostojba === "" ? "Required" : true,
          },
          {
            title: "????????????????", field: 'kolicina',
            validate: rowData => rowData.kolicina === undefined || rowData.kolicina === "" ? "Required" : true,
          },
          {
            title: "??????????", field: 'multiplikator',
            validate: rowData => rowData.multiplikator === undefined || rowData.multiplikator === "" ? "Required" : true,
          },
          {
            title: "???????????? ????????????????", field: 'vkupnoKolicina',
            validate: rowData => rowData.vkupnoKolicina === undefined || rowData.vkupnoKolicina === "" ? "Required" : true,
          },

          {
            title: "???????? ?????????? ??????????", field: 'brojNaMernoMesto',
            validate: rowData => rowData.brojNaMernoMesto === undefined || rowData.brojNaMernoMesto === "" ? "Required" : true,
          },
          {
            title: "???????? ????????????", field: 'brojNaBroilo',
            validate: rowData => rowData.brojNaBroilo === undefined || rowData.brojNaBroilo === "" ? "Required" : true,
          },
        
          {
            title: "?????????? ???? ??????", field: 'datumNaIzrabotkaEVN',
            validate: rowData => rowData.datumNaIzrabotkaEVN === undefined || rowData.datumNaIzrabotkaEVN === "" ? "Required" : true,
          },

    ]
      return (
        <div>
          
          <center>
            <h1> 
              ?????????????? ???????????????? (???????????? ????????)<br/><br/>

            </h1>
            <div>
                <input type="file" name="stornoData" accept=".csv" onChange={this.onFileChange} /><br/>
                <button onClick={this.onFileUpload}>
                  ??????????????!
                </button>
            </div>
          {this.fileData()}
          </center>
          <MaterialTable
              title="???????????????????? ????????????"
              columns={columns}
              data={this.state.data}
              components={{
                Pagination: PatchedPagination,
              }}
              editable={{
                onRowAdd: (newRow) => new Promise((resolve, reject) => {
                  axios.post("/storno/dodadiStorno",{
                    brojNaMernaTocka:newRow.brojNaMernaTocka,
                    mesecNaFakturiranje:newRow.mesecNaFakturiranje,
                    tarifa:newRow.tarifa,
                    datumNaPocetokNaMerenje:newRow.datumNaPocetokNaMerenje,
                    datumNaZavrshuvanjeNaMerenje:newRow.datumNaZavrshuvanjeNaMerenje,
                    pocetnaSostojba:newRow.pocetnaSostojba,
                    krajnaSostojba:newRow.krajnaSostojba,
                    kolicina:newRow.kolicina,
                    multiplikator:newRow.multiplikator,
                    vkupnoKolicina:newRow.vkupnoKolicina,
                    brojNaMernoMesto:newRow.brojNaMernoMesto,
                    brojNaBroilo:newRow.brojNaBroilo,
                    datumNaIzrabotkaEVN:newRow.datumNaIzrabotkaEVN,
                  },{withCredentials:true}).then(()=>{
                    this.getData()
                    resolve()
                  })
                  
                }),
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/storno/izbrisiStorno",{
                    id:selectedRow.id
                    
                  },{withCredentials:true}).then(()=>{
                    this.getData()
                    resolve()
                  })
                  resolve()
                }),
                onRowUpdate: (updatedRow,oldRow) => new Promise((resolve,reject) => {
                  axios.post("/storno/promeniStorno",{
                    id:oldRow.id,
                    brojNaMernaTocka:updatedRow.brojNaMernaTocka,
                    mesecNaFakturiranje:updatedRow.mesecNaFakturiranje,
                    tarifa:updatedRow.tarifa,
                    datumNaPocetokNaMerenje:updatedRow.datumNaPocetokNaMerenje,
                    datumNaZavrshuvanjeNaMerenje:updatedRow.datumNaZavrshuvanjeNaMerenje,
                    pocetnaSostojba:updatedRow.pocetnaSostojba,
                    krajnaSostojba:updatedRow.krajnaSostojba,
                    kolicina:updatedRow.kolicina,
                    multiplikator:updatedRow.multiplikator,
                    vkupnoKolicina:updatedRow.vkupnoKolicina,
                    brojNaMernoMesto:updatedRow.brojNaMernoMesto,
                    brojNaBroilo:updatedRow.brojNaBroilo,
                    datumNaIzrabotkaEVN:updatedRow.datumNaIzrabotkaEVN
                  },{withCredentials:true}).then(()=>{
                    this.getData()
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
  }
 
  export default UploadStornoData;
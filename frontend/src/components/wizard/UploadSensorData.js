import axios from 'axios';
 
import React,{Component} from 'react';
 
class UploadSensorData extends Component {
    constructor(props){
      super(props)
      this.handleChange = this.handleChange.bind(this);
    }
    state = {
      selectedFile: null
    };
    onFileChange = event => {
      this.setState({ selectedFile: event.target.files[0] });
    
    };
    test = () =>{
      this.props.editStep(0,0)
    }
     handleChange = (prvo, vtoro)=>{
      this.props.editStep(prvo,vtoro)
    }
    onFileUpload = () => {
      const formData = new FormData();
      if(this.state.selectedFile!==null){
      formData.append(
        "sensorData",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    
      axios.post("/broilo/uploadfile", formData,{withCredentials:true}).then((res)=>{
        if(res.data.message==="success"){
          this.test()
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
            <span style={{fontSize: "16px"}}>Изберете документ пред да прикачите</span>
          
          </div>
        );
      }
    };
    
    render() {
    
      return (
        <div>
          
          <center>
            <h1> 
              Прикачи документ (Состојба на потрошена енeргија)<br/><br/>

            </h1>
            <div>
                <input type="file" name="sensorData" accept=".csv" onChange={this.onFileChange} /><br/>
                <button onClick={this.onFileUpload}>
                  Прикачи!
                </button>
            </div>
          {this.fileData()}
          </center>
        </div>
      );
    }
  }
 
  export default UploadSensorData;
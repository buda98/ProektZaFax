
import React, { Component} from 'react';
import axios from 'axios';
import UploadSensorData from "./wizard/UploadSensorData"
import BroilosTable from "./BroilosTable"
import FirmiTable from "./wizard/FirmiTable"
import UsersTable from "./wizard/UsersTable"
import ZelenaEnergijaData from "./wizard/ZelenaEnergijaData"
import MerniTockiTable from "./wizard/MerniTockiTable"
axios.defaults.baseURL = 'http://172.21.0.3:5000';
export default class Login extends Component {
    
        render(){
    
        return (
            <div>
            {/* <AddCompany/> */}
            <UploadSensorData step={2} stepState={1} editStep={()=>{}}/>
            <BroilosTable step={2} stepState={1} editStep={()=>{}}/>
            <ZelenaEnergijaData step={2} stepState={1} editStep={()=>{}}/>
            <FirmiTable step={2} stepState={1} editStep={()=>{}}/>
            <UsersTable step={2} stepState={1} editStep={()=>{}}/>
            <MerniTockiTable step={2} stepState={1} editStep={()=>{}}/>
            </div>
    );
        }
}


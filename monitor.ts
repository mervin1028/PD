import { Component, ViewChild } from '@angular/core';
import { NavController} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Chart } from 'chart.js';


@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html'
})

export class MonitorPage {
  arrData = []
  result = []
  timeStamp = []
  valueTemp = []
  valueHum = []
  valuePh = []
  Temperatures = []
  humidity = ""
  temperature = ""
  acidity = ""
  sensor_humidity = ""
  sensor_temperature = ""
  sensor_acidity = ""
  cropName1 = ""
  cropName2 = ""
  cropName3 = ""

  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('lineCanvas2') lineCanvas2;
  @ViewChild('lineCanvas3') lineCanvas3;
  
  lineChart: any;
  lineChart2: any;
  lineChart3: any;

  constructor(public navCtrl: NavController, public firebaseDb: AngularFireDatabase){
    this.firebaseDb.list('/Sensor_Data').valueChanges().subscribe(snapshots=>{
      this.arrData = snapshots;
    
      this.sensor_humidity = this.arrData[0];
      this.sensor_acidity = this.arrData[1];
      this.sensor_temperature = this.arrData[2];
      this.humidity = this.arrData[3];
      this.acidity = this.arrData[4];
      this.temperature = this.arrData[5];
      
    });
    this.firebaseDb.list('/Crop_Data/Crop_Name').valueChanges().subscribe(snapshots=>{
      this.arrData = snapshots;
      this.cropName1 = this.arrData[0];
      this.cropName2 = this.arrData[1];
      this.cropName3 = this.arrData[2];

  
    });

    //var timeanddateLabel = [];
    this.firebaseDb.list('Realtime_Data', ref => ref.limitToLast(12)).snapshotChanges().map(actions =>{
      this.timeStamp = [];
      return actions.map(action => ({ key: action.key, ...action.payload.val()}));
    }).subscribe(dates => {
      dates.map(date => {
        this.timeStamp.push(date.key);
      });
    });
  
    //var getValueTemp = [];
    this.firebaseDb.list('Realtime_Data', ref => ref.limitToLast(12)).valueChanges().subscribe(snapshots=>{
      this.valueTemp = [];
      this.valueHum = [];
      this.valuePh = [];
      this.result = snapshots;
      this.result.map(key => {
        this.valueTemp.push(key.Measured_Temp_C);
        this.valueHum.push(key.Measured_Humidity);
        this.valuePh.push(key.Measured_PHLevel);
      });
    });
  
  
    //this.valueTemp=getValueTemp;
    //this.timeStamp=timeanddateLabel;
    
  }
  
  updateValues(){
    this.lineChart.update();
  }
  
  ionViewDidLoad(){
      var temp = this;
      setInterval(function(){
        temp.lineChart = new Chart(temp.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: temp.timeStamp,
            datasets: [{
              label: "Temperature Graph",
              backgroundColor: 'rgba(77,83,96,0.2)',
              borderColor: 'rgba(77,83,96,1)',
              pointBackgroundColor: 'rgba(77,83,96,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(77,83,96,1)',
              data: temp.valueTemp,
              spanGaps: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false,
                  max: 30,
                  min: 0
                }
              }] 
            }
            
          }
        
        });

        temp.lineChart2 = new Chart(temp.lineCanvas2.nativeElement, {
          type: 'line',
          data: {
            labels: temp.timeStamp,
            datasets: [{
              label: "Humidity Graph <3",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: 'round',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'round',
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: temp.valueHum,
              spanGaps: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false,
                  max: 100,
                  min: 50
                }
              }]
            }
            
          }
        
        });
  
        temp.lineChart3 = new Chart(temp.lineCanvas3.nativeElement, {
          type: 'line',
          data: {
            labels: temp.timeStamp,
            datasets: [{
              label: "pH Graph <3",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: 'round',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'round',
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: temp.valuePh,
              spanGaps: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false,
                  max: 15,
                  min: 0
                }
              }]
            }
            
          }
        
        });




        temp.lineChart.update();
        temp.lineChart2.update();
        temp.lineChart3.update();
      }, 5000);

      
    
  }
  

}



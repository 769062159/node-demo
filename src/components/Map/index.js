import React from 'react';
import { message } from 'antd';
import { Map, Marker } from 'react-amap';
import styles from './index.less';

// const Map = ReactAMAP.Map;
// const Marker = ReactAMAP.Marker;
// const Markers = ReactAMAP.Markers;

export default class MyMap extends React.Component {
  constructor() {
    super();
    const _this = this;
    this.map = null;
    this.marker = null;
    this.geocoder = null;
    this.mapEvents = {
      created(map) {
        _this.map = map;
        AMap.plugin('AMap.Geocoder', () => {
          _this.geocoder = new AMap.Geocoder({
            // city: '010', // 城市，默认：“全国”
          });
        });
      },
      click(e) {
        const lnglat = e.lnglat;
        _this.setState({
          position: lnglat,
          currentLocation: 'loading...',
        });
        const { handleMapAddress } = _this.props;
        _this.geocoder &&
          _this.geocoder.getAddress(lnglat, (status, result) => {
            const { regeocode: { addressComponent: { district }, formattedAddress } } = result;
            const address = formattedAddress.split(district)[1];
            handleMapAddress(lnglat, address);
            if (status === 'complete') {
              if (result.regeocode) {
                _this.setState({
                  currentLocation: result.regeocode.formattedAddress || '未知地点',
                });
              } else {
                _this.setState({
                  currentLocation: '未知地点',
                });
              }
            } else {
              _this.setState({
                currentLocation: '未知地点',
              });
            }
          });
      },
    };
    this.markerEvents = {};
    this.state = {
      position: { longitude: 120.209092, latitude: 30.245326 },
      currentLocation: '点击地图',
    };
  }
  componentWillReceiveProps(prevProps) {
    const { propsAddress } = prevProps;
    const { propsAddress: oldpropsAddress, handleMapAddress } = this.props;
    if (propsAddress && propsAddress !== oldpropsAddress) {
      this.geocoder.getLocation(propsAddress, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const location = result.geocodes[0].location;
          const currentLocation = result.geocodes[0].formattedAddress;
          handleMapAddress(location);
          const position = {
            longitude: location.lng,
            latitude: location.lat,
          };
          this.setState({
            position,
            currentLocation,
          });
        } else {
          message.error('搜索不到该地址！');
        }
    });
    }
  }
  render() {
    return (
      <div style={{ width: '100%', height: 370 }}>
        <Map center={this.state.position} events={this.mapEvents} zoom={10}>
          <Marker position={this.state.position} events={this.markerEvents} />
          <div className={styles.location}>{this.state.currentLocation}</div>
        </Map>
      </div>
    );
  }
}

// import { Map, Marker } from 'react-amap';
// // MouseTool
// const layerStyle = {
//   padding: '10px',
//   background: '#fff',
//   border: '1px solid #ddd',
//   borderRadius: '4px',
//   position: 'absolute',
//   top: '10px',
//   left: '10px',
// };

// export default class AMap extends PureComponent{
//   constructor(){
//     super();
//     const self =this;
//     this.state = {
//       position: '',
//       markerPosition: {longitude: 121, latitude: 36},
//     };
//     this.events = {
//       created: (instance) => {
//         console.log(instance);
//       },
//       click: (e) => {
//         const { lnglat } = e;
//         const obj = {
//           latitude: lnglat.lat,
//           longitude: lnglat.lng,
//         }
//         console.log(obj);
//         self.drawWhats(obj);
//         // self.markerPosition = obj;
//       },
//     }
//     // this.toolEvents = {
//     //   created: (tool) => {
//     //     console.log(tool)
//     //     self.tool = tool;
//     //     self.tool.marker();
//     //   },
//     //   draw(x) {
//     //     console.log(x);
//     //     // self.drawWhat(obj);
//     //   },
//     // }
//     // this.tool.marker();
//     this.mapPlugins = ['ToolBar'];
//     this.mapCenter = {longitude: 120, latitude: 35};
//     // this.markerPosition = {longitude: 121, latitude: 36};
//     this.markerEvents = {
//       click: () => {
//         console.log('marker clicked!')
//       },
//     }
//   }
//   drawWhats(obj) {
//     this.setState({
//       markerPosition: obj,
//       position: `坐标位置是 {${obj.longitude} ${obj.latitude}}`,
//     })
//   }
//   drawWhat(obj) {
//     console.log(obj);
//     // Map.clearOverlays();
//     console.log(obj.getPosition());
//     // const pos = obj.getPosition();
//     this.setState({
//       position: `坐标位置是 {${obj.getPosition()}}`,
//     })
//     // let text = '';
//     // switch(obj.CLASS_NAME) {
//     //   case 'AMap.Marker':
//     //    text = `你绘制了一个标记，坐标位置是 {${obj.getPosition()}}`;
//     //    break;
//     //   case 'AMap.Polygon':
//     //     text = `你绘制了一个多边形，有${obj.getPath().length}个端点`;
//     //     break;
//     //   case 'AMap.Circle':
//     //     text = `你绘制了一个圆形，圆心位置为{${obj.getCenter()}}`;
//     //     break;
//     //   default:
//     //     text = '';
//     // }
//     // this.setState({
//     //   what: text,
//     // });
//   }

//   // drawCircle(){
//   //   if(this.tool){
//   //     this.tool.circle();
//   //     this.setState({
//   //       what: '准备绘制圆形',
//   //     });
//   //   }
//   // }

//   // drawRectangle(){
//   //   if(this.tool){
//   //     this.tool.rectangle();
//   //     this.setState({
//   //       what: '准备绘制多边形（矩形）',
//   //     });
//   //   }
//   // }

//   // drawMarker(){
//   //   if (this.tool){
//   //     this.tool.marker();
//   //     this.setState({
//   //       what: '准备绘制坐标点',
//   //     });
//   //   }
//   // }

//   // drawPolygon() {
//   //   if (this.tool) {
//   //     this.tool.polygon();
//   //     this.setState({
//   //       what: '准备绘制多边形',
//   //     });
//   //   }
//   // }

//   // close(){
//   //   if (this.tool){
//   //     this.tool.close();
//   //   }
//   //   this.setState({
//   //     what: '关闭了鼠标工具',
//   //   });
//   // }
//   render(){
//     const { markerPosition, position } = this.state;
//     return (
//       <div>
//         <div style={{width: '100%', height: 370}}>
//           <Map
//             plugins={this.mapPlugins}
//             center={this.mapCenter}
//             zoom={7}
//             events={this.events}
//           >
//             {/* <MouseTool events={this.toolEvents} /> */}
//             <Marker position={markerPosition} />
//             <div style={layerStyle}>{position}</div>
//           </Map>
//         </div>
//         {/* <button onClick={()=>{this.drawMarker()}}>Draw Marker</button>
//         <button onClick={()=>{this.drawRectangle()}}>Draw Rectangle</button>
//         <button onClick={()=>{this.drawCircle()}}>Draw Circle</button>
//         <button onClick={()=>{this.drawPolygon()}}>Draw Polygon</button>
//         <button onClick={()=>{this.close()}}>Close</button> */}
//       </div>
//     )
//   }
// }

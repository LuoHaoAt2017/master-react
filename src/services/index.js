import request from "./request";
import urls from './urls';

export function getDeviceListByOrg() {
  return request(urls.deviceList, {
    method: 'get'
  })
}

// export function getDeviceListByOrg() {
//   return new Promise(function (resolve) {
//     setTimeout(() => {
//       resolve({
//         code: 'SUCCESS',
//         mesgCode: 'SUCCESS',
//         data: [
//           {
//             key: '001',
//             deviceName: "MR560",
//             deviceCode: "MR560",
//           },
//           {
//             key: '002',
//             deviceName: "MR570",
//             deviceCode: "MR570",
//           },
//           {
//             key: '003',
//             deviceName: "MR580",
//             deviceCode: "MR580",
//           },
//         ]
//       })
//     }, 1500);
//   });
// }
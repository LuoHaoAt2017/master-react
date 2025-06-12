import mockjs from "mockjs";
import urls from "../services/urls";

const { Random, mock } = mockjs;

const formatData = (data) => ({
  code: "SUCCESS",
  mesgCode: "SUCCESS",
  data: data
});

Random.extend({
  deviceId: function () {
    return Random.guid()
  },
  deviceCode: function () {
    return this.pick(["MR560", "MR640", "MR780", "MR960"]);
  },
  deviceName: function () {
    return this.pick(["MR560", "MR640", "MR780", "MR960"]);
  }
});

export default [
  {
    url: urls.deviceList,
    method: 'get',
    // timeout: 500,
    response: ({ query }) => {
      console.log("query: ", query);
      const data = mock({
        'list|10': [{
          deviceId: "@deviceId",
          deviceCode: "@deviceCode",
          deviceName: "@deviceName",
        }]
      }).list;
      return formatData(data);
    }
  }
]
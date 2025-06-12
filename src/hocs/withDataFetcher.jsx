import React, { Component } from "react";
import { notification } from "antd";

const withDataFetcher = (config) => (WrappedComponent) => {
  return class WithDataFetcher extends Component {

    constructor(props) {
      super(props);

      this.state = {
        dataSource: null,
        loading: false,
        error: null,
      }
    }

    componentDidMount() {
      const { service, params } = config;
      this.setState({ loading: true });
      service(params).then((resp) => {
        if (resp.code === "SUCCESS") {
          this.setState({ dataSource: resp.data });
        } else {
          notification.error(resp.mesgCode);
        }
      }).catch((err) => {
        this.setState({ error: err });
      }).finally(() => {
        this.setState({ loading: false });
      });
    }

    render() {
      const { dataSource, loading, error } = this.state;
      return <WrappedComponent data={dataSource} loading={loading} error={error} />
    }
  }
}

export default withDataFetcher;
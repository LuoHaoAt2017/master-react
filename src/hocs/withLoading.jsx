import { Component } from "react";
import { Spin } from "antd";

function withLoading(WrappedComponent) {

  return class CompLoading extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { loading, ...restProps } = this.props;
      if (loading) {
        return <Spin spinning={loading} tip="正在加载中...请稍后"></Spin>
      }
      return <WrappedComponent {...restProps} />
    }
  }
}

export default withLoading;
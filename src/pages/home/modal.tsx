import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import useCommentStore from '@/store/useCommentStore';

interface IProps {
  content: string,
  anchor?: Anchor,
}

const CommentModal: React.FC<IProps> = (props) => {
  const visible = useCommentStore(s => s.visible);
  const setVisible = useCommentStore(s => s.setVisible);
  const addComment = useCommentStore(s => s.addComment);

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((fields) => {
      if (props.anchor && fields.content) {
        addComment({
          id: Date.now().toString(),
          content: fields.content,
          anchor: props.anchor,
        } as Comment);
        setVisible(false);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const handleCancel = () => {
    setVisible(false);
  }

  useEffect(() => {
    if (visible && props.content) {
      form.setFieldsValue({
        content: props.content
      });
    }
  }, [visible, props, form]);

  return <>
    <Modal
      open={visible}
      closable={false}
      maskClosable={false}
      destroyOnClose
      title={'评论管理'}
      cancelText='关闭'
      okText='确定'
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <Form labelCol={{ span: 24 }} form={form}>
        <Form.Item name={'content'} rules={[{ required: true }]}>
          <Input.TextArea autoSize={{ minRows: 3 }} />
        </Form.Item>
      </Form>
    </Modal>
  </>
}

export default CommentModal;
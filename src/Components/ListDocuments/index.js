import React from 'react';
import moment from 'moment';
import { Col, Drawer, Row, Button, Input, Table, Tooltip } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Last Modified Date',
    dataIndex: 'modifiedTime',
    key: 'modifiedTime',
    render: (text) => <span>{moment(text).format('Do MMM YYYY HH:mm A')}</span>,
  },
  {
    title: 'Action',
    key: 'status',
    dataIndex: 'status',
    render: (tag) => (
      <span>
        <Tooltip title="View Document">
          <Button type="primary" ghost>
            Select
          </Button>
        </Tooltip>
      </span>
    ),
  },
];
const ListDocuments = ({ visible, onClose, documents = [] }) => {
  return (
    <Drawer
      title="Select Google Drive Document"
      placement="right"
      closable
      onClose={onClose}
      visible={visible}
      width={900}
    >
      <Row gutter={16}>
        <Col span={24}>
          <div className="table-card-actions-container">
            <div className="table-search-container">
              <Input placeholder="Search Google Drive" className="table-search-input" />
            </div>
          </div>
          <Table className="table-striped-rows" columns={columns} dataSource={documents} />
        </Col>
      </Row>
    </Drawer>
  );
};

export default ListDocuments;

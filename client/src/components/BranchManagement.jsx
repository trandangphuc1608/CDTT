import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';

const BranchManagement = () => {
    const [branches, setBranches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/branches');
            setBranches(res.data);
        } catch (error) {
            message.error("Lỗi tải danh sách chi nhánh!");
        }
    };

    const handleAdd = () => {
        setEditingBranch(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingBranch(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/branches/${id}`);
            message.success("Đã xóa chi nhánh!");
            fetchBranches();
        } catch (error) {
            message.error("Không thể xóa chi nhánh này!");
        }
    };

    const onFinish = async (values) => {
        try {
            if (editingBranch) {
                await axios.put(`http://localhost:8081/api/branches/${editingBranch.id}`, values);
                message.success("Cập nhật thành công!");
            } else {
                await axios.post('http://localhost:8081/api/branches', values);
                message.success("Thêm mới thành công!");
            }
            setIsModalOpen(false);
            fetchBranches();
        } catch (error) {
            message.error("Có lỗi xảy ra!");
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Tên Chi Nhánh', dataIndex: 'name', key: 'name', render: (text) => <b>{text}</b> },
        { title: 'Địa Chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Số Điện Thoại', dataIndex: 'phone', key: 'phone' },
        { 
            title: 'Trạng Thái', 
            dataIndex: 'active', 
            key: 'active',
            render: (active) => active ? <span style={{color: 'green'}}>Đang hoạt động</span> : <span style={{color: 'red'}}>Tạm đóng</span>
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2><ShopOutlined /> Quản Lý Chi Nhánh</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Chi Nhánh</Button>
            </div>
            
            <Table columns={columns} dataSource={branches} rowKey="id" />

            <Modal 
                title={editingBranch ? "Sửa Chi Nhánh" : "Thêm Chi Nhánh Mới"} 
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ active: true }}>
                    <Form.Item name="name" label="Tên Chi Nhánh" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa Chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số Điện Thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="active" label="Hoạt động" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {editingBranch ? "Cập Nhật" : "Thêm Mới"}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default BranchManagement;
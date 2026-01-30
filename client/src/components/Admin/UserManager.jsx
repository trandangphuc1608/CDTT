import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import axios from 'axios';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users');
            setUsers(res.data);
        } catch (error) {
            message.error('Lỗi tải danh sách người dùng!');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleFinish = async (values) => {
        try {
            if (editingUser) {
                await axios.put(`/api/users/${editingUser.id}`, values);
                message.success('Cập nhật thành công!');
            } else {
                await axios.post('/api/users', values);
                message.success('Thêm người dùng thành công!');
            }
            fetchUsers();
            setIsModalOpen(false);
            form.resetFields();
            setEditingUser(null);
        } catch (error) {
            message.error('Lỗi lưu dữ liệu (có thể trùng username)!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`);
            message.success('Đã xóa người dùng!');
            fetchUsers();
        } catch (error) {
            message.error('Lỗi khi xóa!');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: 'Họ và Tên', dataIndex: 'fullName', className: 'fw-bold' },
        { title: 'Tài khoản', dataIndex: 'username' },
        { 
            title: 'Vai trò', 
            dataIndex: 'role',
            render: (role) => {
                let color = 'geekblue';
                if (role === 'ADMIN') color = 'red';
                if (role === 'KITCHEN') color = 'orange';
                if (role === 'CASHIER') color = 'green';
                return <Tag color={color}>{role}</Tag>;
            }
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button icon={<EditOutlined />} onClick={() => {
                        setEditingUser(record);
                        form.setFieldsValue(record);
                        setIsModalOpen(true);
                    }} />
                    <Popconfirm title="Xóa người này?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 bg-white rounded shadow-sm">
            <div className="flex justify-between mb-4">
                <h3 className="text-xl font-bold">Quản lý Nhân sự & Khách hàng</h3>
                <Button type="primary" icon={<UserAddOutlined />} onClick={() => { setEditingUser(null); form.resetFields(); setIsModalOpen(true); }}>
                    Thêm Người dùng
                </Button>
            </div>
            <Table dataSource={users} columns={columns} rowKey="id" />

            <Modal
                title={editingUser ? "Sửa thông tin" : "Thêm người dùng mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="fullName" label="Họ và Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
                        <Input disabled={!!editingUser} />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: !editingUser, message: 'Cần nhập mật khẩu' }]}>
                        <Input.Password placeholder={editingUser ? "Để trống nếu không đổi" : ""} />
                    </Form.Item>
                    <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="ADMIN">Quản trị viên (Admin)</Select.Option>
                            <Select.Option value="CASHIER">Thu ngân (Cashier)</Select.Option>
                            <Select.Option value="KITCHEN">Đầu bếp (Kitchen)</Select.Option>
                            <Select.Option value="CUSTOMER">Khách hàng (Customer)</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManager;
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    // 1. Load dữ liệu
    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/categories');
            setCategories(res.data);
        } catch (error) {
            message.error('Lỗi tải danh mục!');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 2. Xử lý Thêm/Sửa
    const handleFinish = async (values) => {
        try {
            if (editingCategory) {
                await axios.put(`http://localhost:8081/api/categories/${editingCategory.id}`, values);
                message.success('Cập nhật thành công!');
            } else {
                await axios.post('http://localhost:8081/api/categories', values);
                message.success('Thêm mới thành công!');
            }
            fetchCategories();
            setIsModalOpen(false);
            form.resetFields();
            setEditingCategory(null);
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    // 3. Xử lý Xóa
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/categories/${id}`);
            message.success('Đã xóa danh mục!');
            fetchCategories();
        } catch (error) {
            message.error('Không thể xóa danh mục này (có thể đang chứa sản phẩm)!');
        }
    };

    // 4. Cấu hình cột cho bảng
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên danh mục', dataIndex: 'name', key: 'name', className: 'font-semibold' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => {
                            setEditingCategory(record);
                            form.setFieldsValue(record);
                            setIsModalOpen(true);
                        }} 
                    />
                    <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Quản lý Danh mục</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCategory(null); form.resetFields(); setIsModalOpen(true); }}>
                    Thêm Danh mục
                </Button>
            </div>
            
            <Table dataSource={categories} columns={columns} rowKey="id" bordered />

            <Modal
                title={editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManager;
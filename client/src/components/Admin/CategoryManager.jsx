import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const CategoryManager = () => {
    // 1. Khởi tạo mảng rỗng [] để tránh lỗi null
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    // 2. Load dữ liệu an toàn
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/categories');
            
            // --- BẢO VỆ: Kiểm tra xem có phải mảng không ---
            if (Array.isArray(res.data)) {
                setCategories(res.data);
            } else {
                console.warn("API Categories trả về dữ liệu lạ:", res.data);
                setCategories([]); // Nếu lỗi thì set rỗng
            }
            // ----------------------------------------------

        } catch (error) {
            console.error("Lỗi API:", error);
            message.error('Lỗi tải danh mục!');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 3. Xử lý Thêm/Sửa
    const handleFinish = async (values) => {
        try {
            if (editingCategory) {
                await axios.put(`/api/categories/${editingCategory.id}`, values);
                message.success('Cập nhật thành công!');
            } else {
                await axios.post('/api/categories', values);
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

    // 4. Xử lý Xóa
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/categories/${id}`);
            message.success('Đã xóa danh mục!');
            fetchCategories();
        } catch (error) {
            message.error('Không thể xóa danh mục này (có thể đang chứa sản phẩm)!');
        }
    };

    // 5. Cấu hình cột
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80, align: 'center' },
        { title: 'Tên danh mục', dataIndex: 'name', key: 'name', className: 'font-semibold' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
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
                    <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)} okButtonProps={{ danger: true }}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 bg-white rounded shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold m-0">Quản lý Danh mục</h3>
                <div className="flex gap-2">
                    <Button icon={<ReloadOutlined />} onClick={fetchCategories}>Làm mới</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCategory(null); form.resetFields(); setIsModalOpen(true); }}>
                        Thêm Danh mục
                    </Button>
                </div>
            </div>
            
            <Table 
                // --- BẢO VỆ DATASOURCE ---
                dataSource={Array.isArray(categories) ? categories : []} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                bordered 
                pagination={{ pageSize: 8 }}
            />

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
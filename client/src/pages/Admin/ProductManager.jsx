import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Image } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Để đổ vào dropdown chọn danh mục
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();

    // Load dữ liệu ban đầu
    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('http://localhost:8081/api/products'),
                axios.get('http://localhost:8081/api/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            message.error('Lỗi tải dữ liệu!');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFinish = async (values) => {
        try {
            // values sẽ chứa: { name, price, description, imageUrl, categoryId }
            if (editingProduct) {
                await axios.put(`http://localhost:8081/api/products/${editingProduct.id}`, values);
                message.success('Cập nhật món ăn thành công!');
            } else {
                await axios.post('http://localhost:8081/api/products', values);
                message.success('Thêm món mới thành công!');
            }
            fetchData();
            setIsModalOpen(false);
            form.resetFields();
            setEditingProduct(null);
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/products/${id}`);
            message.success('Đã xóa món ăn!');
            fetchData();
        } catch (error) {
            message.error('Lỗi khi xóa!');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { 
            title: 'Hình ảnh', 
            dataIndex: 'imageUrl', 
            render: (url) => <Image src={url} width={50} height={50} className="object-cover rounded"/> 
        },
        { title: 'Tên món', dataIndex: 'name', className: 'font-bold' },
        { 
            title: 'Giá', 
            dataIndex: 'price', 
            render: (price) => `${price.toLocaleString()} đ`,
            sorter: (a, b) => a.price - b.price 
        },
        { 
            title: 'Danh mục', 
            dataIndex: 'category',
            render: (cat) => <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{cat?.name}</span>
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => {
                            setEditingProduct(record);
                            // Cần map category object sang categoryId để form hiểu
                            form.setFieldsValue({
                                ...record,
                                categoryId: record.category?.id
                            });
                            setIsModalOpen(true);
                        }} 
                    />
                    <Popconfirm title="Xóa món này?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
             <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Quản lý Thực đơn</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingProduct(null); form.resetFields(); setIsModalOpen(true); }}>
                    Thêm Món mới
                </Button>
            </div>

            <Table dataSource={products} columns={columns} rowKey="id" bordered pagination={{ pageSize: 6 }} />

            <Modal
                title={editingProduct ? "Cập nhật món" : "Thêm món mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="name" label="Tên món ăn" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="price" label="Giá bán (VNĐ)" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')}/>
                        </Form.Item>
                        <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Phải chọn danh mục!' }]}>
                            <Select placeholder="Chọn danh mục">
                                {categories.map(cat => (
                                    <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item name="imageUrl" label="Link hình ảnh (URL)">
                        <Input placeholder="https://..." />
                    </Form.Item>
                    
                    <Form.Item name="description" label="Mô tả chi tiết">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManager;
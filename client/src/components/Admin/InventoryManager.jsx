import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, ImportOutlined, AlertOutlined } from '@ant-design/icons';
import axios from 'axios';

const InventoryManager = () => {
    const [ingredients, setIngredients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [importForm] = Form.useForm();

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/inventory');
            setIngredients(res.data);
        } catch (error) {
            message.error('Lỗi tải kho!');
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Xử lý Thêm/Sửa thông tin
    const handleFinish = async (values) => {
        try {
            if (editingItem) {
                await axios.put(`http://localhost:8081/api/inventory/${editingItem.id}`, values);
                message.success('Cập nhật thành công!');
            } else {
                await axios.post('http://localhost:8081/api/inventory', values);
                message.success('Thêm nguyên liệu mới thành công!');
            }
            fetchData();
            setIsModalOpen(false);
            form.resetFields();
            setEditingItem(null);
        } catch (error) { message.error('Lỗi lưu dữ liệu!'); }
    };

    // Xử lý Nhập kho (Cộng thêm)
    const handleImportFinish = async (values) => {
        try {
            await axios.put(`http://localhost:8081/api/inventory/${editingItem.id}/import?amount=${values.amount}`);
            message.success('Nhập kho thành công!');
            fetchData();
            setIsImportModalOpen(false);
            importForm.resetFields();
            setEditingItem(null);
        } catch (error) { message.error('Lỗi nhập kho!'); }
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8081/api/inventory/${id}`);
        message.success('Đã xóa!');
        fetchData();
    };

    const columns = [
        { title: 'Tên nguyên liệu', dataIndex: 'name', className: 'font-bold' },
        { title: 'Đơn vị', dataIndex: 'unit', align: 'center' },
        { 
            title: 'Tồn kho', 
            dataIndex: 'quantity', 
            render: (qty, record) => {
                const isLow = qty <= record.minLimit;
                return (
                    <span style={{ color: isLow ? 'red' : 'green', fontWeight: 'bold' }}>
                        {qty} {isLow && <Tooltip title="Sắp hết hàng!"><AlertOutlined className="ml-2" /></Tooltip>}
                    </span>
                );
            }
        },
        { title: 'Cảnh báo khi <', dataIndex: 'minLimit', align: 'center', render: t => <Tag>{t}</Tag> },
        {
            title: 'Hành động',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Tooltip title="Nhập thêm hàng">
                        <Button type="primary" ghost icon={<ImportOutlined />} onClick={() => {
                            setEditingItem(record);
                            setIsImportModalOpen(true);
                        }} />
                    </Tooltip>
                    <Tooltip title="Sửa thông tin">
                        <Button icon={<EditOutlined />} onClick={() => {
                            setEditingItem(record);
                            form.setFieldsValue(record);
                            setIsModalOpen(true);
                        }} />
                    </Tooltip>
                    <Popconfirm title="Xóa nguyên liệu này?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 bg-white rounded shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold m-0">Quản lý Kho Nguyên Liệu</h3>
                <div className="flex gap-2">
                    <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>
                        Thêm Nguyên Liệu
                    </Button>
                </div>
            </div>
            
            <Table dataSource={ingredients} columns={columns} rowKey="id" bordered pagination={{ pageSize: 8 }} />

            {/* MODAL THÊM/SỬA */}
            <Modal title={editingItem ? "Sửa Nguyên Liệu" : "Thêm Nguyên Liệu"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="name" label="Tên nguyên liệu" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]}>
                            <Input placeholder="kg, lít, cái..." />
                        </Form.Item>
                        <Form.Item name="quantity" label="Số lượng ban đầu" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </div>
                    <Form.Item name="minLimit" label="Mức cảnh báo (Tồn kho thấp)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} placeholder="VD: 10" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL NHẬP KHO NHANH */}
            <Modal title={`Nhập kho: ${editingItem?.name}`} open={isImportModalOpen} onCancel={() => setIsImportModalOpen(false)} onOk={() => importForm.submit()}>
                <Form form={importForm} layout="vertical" onFinish={handleImportFinish}>
                    <Form.Item name="amount" label="Số lượng nhập thêm" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
                        <InputNumber style={{ width: '100%' }} min={0.1} autoFocus />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryManager;
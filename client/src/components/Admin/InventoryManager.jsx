import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ImportOutlined, WarningOutlined } from '@ant-design/icons';
import axios from 'axios';

const InventoryManager = () => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State Modal Thêm/Sửa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    
    // State Modal Nhập Kho
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importItem, setImportItem] = useState(null);

    const [form] = Form.useForm();
    const [importForm] = Form.useForm();

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/ingredients');
            setIngredients(res.data);
        } catch (error) {
            message.error("Lỗi tải kho!");
        } finally {
            setLoading(false);
        }
    };

    // --- 1. XỬ LÝ THÊM / SỬA ---
    const handleSave = async (values) => {
        try {
            if (editingItem) {
                // Gọi API Sửa
                await axios.put(`/api/ingredients/${editingItem.id}`, values);
                message.success("Cập nhật thành công!");
            } else {
                // Gọi API Thêm mới
                await axios.post('/api/ingredients', values);
                message.success("Thêm nguyên liệu thành công!");
            }
            fetchIngredients();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            // Hiển thị lỗi từ Backend (ví dụ: Tên trùng)
            message.error(error.response?.data || "Lỗi lưu dữ liệu!");
        }
    };

    // --- 2. XỬ LÝ XÓA (QUAN TRỌNG) ---
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa nguyên liệu này?")) return;
        try {
            await axios.delete(`/api/ingredients/${id}`);
            message.success("Đã xóa!");
            fetchIngredients();
        } catch (error) {
            // Hiển thị thông báo lỗi thân thiện nếu đang dùng trong công thức
            message.error(error.response?.data || "Không thể xóa nguyên liệu này!");
        }
    };

    // --- 3. XỬ LÝ NHẬP KHO ---
    const handleImport = async (values) => {
        try {
            await axios.post(`/api/ingredients/${importItem.id}/import`, {
                amount: values.amount
            });
            message.success(`Đã nhập thêm ${values.amount} ${importItem.unit}!`);
            fetchIngredients();
            setIsImportModalOpen(false);
            importForm.resetFields();
        } catch (error) {
            message.error("Lỗi nhập kho!");
        }
    };

    const columns = [
        { 
            title: 'Tên nguyên liệu', 
            dataIndex: 'name', 
            render: (text) => <b>{text}</b> 
        },
        { 
            title: 'Tồn kho', 
            dataIndex: 'quantity',
            align: 'center',
            render: (qty, record) => {
                // Logic hiển thị cảnh báo nếu tồn kho thấp hơn định mức
                const isLow = qty <= (record.minThreshold || 5);
                return (
                    <Tag color={isLow ? 'red' : 'green'} style={{ fontSize: 14, padding: '4px 8px' }}>
                        {qty} {record.unit} {isLow && <WarningOutlined />}
                    </Tag>
                );
            }
        },
        {
            title: 'Mức cảnh báo',
            dataIndex: 'minThreshold',
            align: 'center',
            render: (val) => <span style={{ color: '#888' }}>&le; {val || 5}</span>
        },
        {
            title: 'Đơn vị',
            dataIndex: 'unit',
            align: 'center',
        },
        {
            title: 'Hành động',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary" 
                        icon={<ImportOutlined />} 
                        onClick={() => { 
                            setImportItem(record); 
                            setIsImportModalOpen(true); 
                        }}
                    >
                        Nhập hàng
                    </Button>
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => { 
                            setEditingItem(record); 
                            form.setFieldsValue(record); 
                            setIsModalOpen(true); 
                        }} 
                    />
                    <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(record.id)} 
                    />
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>Quản lý Kho Nguyên Liệu</h2>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => { 
                        setEditingItem(null); 
                        form.resetFields(); 
                        setIsModalOpen(true); 
                    }}
                >
                    Thêm nguyên liệu
                </Button>
            </div>

            <Table 
                dataSource={ingredients} 
                columns={columns} 
                rowKey="id" 
                loading={loading} 
                bordered
                pagination={{ pageSize: 8 }}
            />

            {/* MODAL THÊM / SỬA THÔNG TIN */}
            <Modal
                title={editingItem ? "Sửa Nguyên Liệu" : "Thêm Nguyên Liệu Mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={form.submit}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Tên nguyên liệu" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                        <Input placeholder="Ví dụ: Thịt bò, Trứng..." />
                    </Form.Item>
                    
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <Input placeholder="kg, cái, lít..." />
                        </Form.Item>
                        
                        <Form.Item 
                            name="minThreshold" 
                            label="Báo động khi còn dưới" 
                            initialValue={5}
                            style={{ flex: 1 }}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    {/* Chỉ cho nhập số lượng ban đầu khi tạo mới */}
                    {!editingItem && (
                        <Form.Item name="quantity" label="Số lượng ban đầu" initialValue={0}>
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* MODAL NHẬP HÀNG (CỘNG DỒN) */}
            <Modal
                title={`Nhập thêm hàng: ${importItem?.name}`}
                open={isImportModalOpen}
                onCancel={() => setIsImportModalOpen(false)}
                onOk={importForm.submit}
            >
                <Form form={importForm} layout="vertical" onFinish={handleImport}>
                    <Form.Item 
                        name="amount" 
                        label={`Số lượng nhập thêm (${importItem?.unit})`} 
                        rules={[{ required: true, message: 'Nhập số lượng cần thêm' }]}
                    >
                        <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} autoFocus />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryManager;
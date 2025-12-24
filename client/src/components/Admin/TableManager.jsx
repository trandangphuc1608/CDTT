import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, InputNumber, Select, message, Row, Col, Tag, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const TableManager = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [form] = Form.useForm();

    // Load danh sách bàn
    const fetchTables = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8081/api/tables');
            setTables(res.data);
        } catch (error) {
            message.error("Lỗi tải danh sách bàn!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    // Mở Modal thêm/sửa
    const handleOpenModal = (table = null) => {
        setEditingTable(table);
        if (table) {
            form.setFieldsValue(table);
        } else {
            form.resetFields();
            form.setFieldsValue({ status: 'AVAILABLE', capacity: 4 }); // Mặc định
        }
        setIsModalOpen(true);
    };

    // Xử lý Lưu (Thêm mới hoặc Cập nhật)
    const handleFinish = async (values) => {
        try {
            if (editingTable) {
                // Cập nhật
                await axios.put(`http://localhost:8081/api/tables/${editingTable.id}`, values);
                message.success("Cập nhật bàn thành công!");
            } else {
                // Thêm mới
                await axios.post('http://localhost:8081/api/tables', values);
                message.success("Thêm bàn mới thành công!");
            }
            setIsModalOpen(false);
            fetchTables();
        } catch (error) {
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    // Xóa bàn
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/tables/${id}`);
            message.success("Đã xóa bàn!");
            fetchTables();
        } catch (error) {
            message.error("Không thể xóa bàn này (có thể đang có đơn đặt)!");
        }
    };

    // Màu sắc theo trạng thái
    const getStatusColor = (status) => {
        if (status === 'AVAILABLE') return '#52c41a'; // Xanh lá
        if (status === 'OCCUPIED') return '#ff4d4f';  // Đỏ
        if (status === 'RESERVED') return '#faad14';  // Vàng cam
        return '#d9d9d9';
    };

    const getStatusText = (status) => {
        if (status === 'AVAILABLE') return 'Trống';
        if (status === 'OCCUPIED') return 'Có khách';
        if (status === 'RESERVED') return 'Đã đặt';
        return status;
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2><AppstoreOutlined /> QUẢN LÝ SƠ ĐỒ BÀN</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal(null)}>
                    Thêm bàn mới
                </Button>
            </div>

            {/* SƠ ĐỒ BÀN */}
            <Row gutter={[16, 16]}>
                {tables.map(table => (
                    <Col key={table.id} xs={12} sm={8} md={6} lg={4}>
                        <Card
                            hoverable
                            onClick={() => handleOpenModal(table)}
                            style={{ 
                                textAlign: 'center', 
                                borderTop: `4px solid ${getStatusColor(table.status)}`,
                                backgroundColor: table.status === 'AVAILABLE' ? '#f6ffed' : '#fff1f0'
                            }}
                            actions={[
                                <EditOutlined key="edit" onClick={(e) => { e.stopPropagation(); handleOpenModal(table); }} />,
                                <Popconfirm title="Xóa bàn này?" onConfirm={(e) => { e.stopPropagation(); handleDelete(table.id); }}>
                                    <DeleteOutlined key="delete" style={{ color: 'red' }} onClick={(e) => e.stopPropagation()} />
                                </Popconfirm>
                            ]}
                        >
                            <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{table.name}</div>
                            <div style={{ color: '#666' }}>Sức chứa: {table.capacity} người</div>
                            <div style={{ marginTop: 10 }}>
                                <Tag color={getStatusColor(table.status)} style={{ width: '100%', textAlign: 'center' }}>
                                    {getStatusText(table.status).toUpperCase()}
                                </Tag>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* MODAL THÊM / SỬA */}
            <Modal
                title={editingTable ? "Cập nhật thông tin bàn" : "Thêm bàn mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="name" label="Tên bàn (Ví dụ: Bàn 1)" rules={[{ required: true, message: 'Vui lòng nhập tên bàn!' }]}>
                        <Input placeholder="Nhập tên bàn..." />
                    </Form.Item>

                    <Form.Item name="capacity" label="Sức chứa (số ghế)" rules={[{ required: true }]}>
                        <InputNumber min={1} max={50} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái hiện tại">
                        <Select>
                            <Option value="AVAILABLE">🟢 Trống (Available)</Option>
                            <Option value="OCCUPIED">🔴 Đang có khách (Occupied)</Option>
                            <Option value="RESERVED">🟠 Đã đặt trước (Reserved)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {editingTable ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TableManager;